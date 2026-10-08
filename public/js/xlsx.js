// Da un file .xlsx a una griglia di valori per ogni foglio.
//
// Si leggono solo i valori delle celle, non le formule né gli stili: il calcolo
// lo rifà il tool (ADR-002). L'XML di Office ha una forma fissa e lo si legge
// con espressioni regolari, così lo stesso codice gira nel browser e in Node
// senza DOMParser (ADR-003).

import { apriZip, creaZip } from './zip.js';

const ENTITA = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

export function decodifica(s) {
  return s
    .replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, e) => {
      if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
      return ENTITA[e.toLowerCase()];
    })
    // Office codifica i caratteri di controllo come _xHHHH_ (es. _x000D_ per l'a capo).
    .replace(/_x([0-9a-f]{4})_/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function attributi(s) {
  const a = {};
  for (const m of s.matchAll(/([\w:]+)\s*=\s*"([^"]*)"/g)) a[m[1]] = decodifica(m[2]);
  return a;
}

// Il testo di un <si> o di un <is>: concatena i <t>, anche nei frammenti formattati,
// e ignora la guida fonetica (<rPh>).
function testoRicco(xml) {
  const pulito = xml.replace(/<rPh\b[\s\S]*?<\/rPh>/g, '');
  let out = '';
  for (const m of pulito.matchAll(/<t\b[^>]*?(?:\/>|>([\s\S]*?)<\/t>)/g)) out += decodifica(m[1] ?? '');
  return out;
}

export function leggiStringheCondivise(xml) {
  if (!xml) return [];
  return [...xml.matchAll(/<si\b[^>]*?(?:\/>|>([\s\S]*?)<\/si>)/g)].map((m) => testoRicco(m[1] ?? ''));
}

export function colonnaDaLettere(lettere) {
  let n = 0;
  for (const c of lettere.toUpperCase()) n = n * 26 + (c.charCodeAt(0) - 64);
  return n - 1;
}

// Restituisce le righe come array di array (indice 0 = riga 1, colonna A).
// Celle vuote: ''. Numeri come number, il resto come stringa.
export function leggiFoglio(xml, condivise = []) {
  const righe = [];
  let rigaCorrente = 0;
  for (const m of xml.matchAll(/<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g)) {
    const ar = attributi(m[1]);
    rigaCorrente = ar.r ? parseInt(ar.r, 10) - 1 : rigaCorrente + 1;
    const celle = [];
    let colCorrente = -1;
    for (const c of (m[2] ?? '').matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const ac = attributi(c[1]);
      const rif = ac.r?.match(/^([A-Z]+)\d+$/i);
      colCorrente = rif ? colonnaDaLettere(rif[1]) : colCorrente + 1;
      const corpo = c[2] ?? '';
      const v = corpo.match(/<v\b[^>]*>([\s\S]*?)<\/v>/)?.[1];
      let valore = '';
      if (ac.t === 's') valore = v === undefined ? '' : condivise[parseInt(v, 10)] ?? '';
      else if (ac.t === 'inlineStr') valore = testoRicco(corpo.match(/<is\b[^>]*>([\s\S]*?)<\/is>/)?.[1] ?? '');
      else if (ac.t === 'str' || ac.t === 'e') valore = v === undefined ? '' : decodifica(v);
      else if (ac.t === 'b') valore = v === '1';
      else if (v !== undefined && v !== '') valore = Number(v);
      celle[colCorrente] = valore;
    }
    righe[rigaCorrente] = Array.from(celle, (x) => (x === undefined ? '' : x));
  }
  return Array.from(righe, (r) => r ?? []);
}

function risolvi(base, destinazione) {
  if (destinazione.startsWith('/')) return destinazione.slice(1);
  const parti = base.split('/').slice(0, -1);
  for (const p of destinazione.split('/')) {
    if (p === '..') parti.pop();
    else if (p !== '.') parti.push(p);
  }
  return parti.join('/');
}

export async function leggiXlsx(buffer) {
  const zip = apriZip(buffer);
  const libro = await zip.testo('xl/workbook.xml');
  if (!libro) throw new Error('Il file non è un xlsx: manca xl/workbook.xml.');
  const relazioni = (await zip.testo('xl/_rels/workbook.xml.rels')) ?? '';
  const destinazioni = {};
  let percorsoStringhe = 'xl/sharedStrings.xml';
  for (const m of relazioni.matchAll(/<Relationship\b([^>]*?)\/?>/g)) {
    const a = attributi(m[1]);
    destinazioni[a.Id] = risolvi('xl/workbook.xml', a.Target);
    if (/\/sharedStrings$/.test(a.Type ?? '')) percorsoStringhe = destinazioni[a.Id];
  }
  const condivise = leggiStringheCondivise(await zip.testo(percorsoStringhe));

  const fogli = [];
  for (const m of libro.matchAll(/<sheet\b([^>]*?)\/?>/g)) {
    const a = attributi(m[1]);
    const percorso = destinazioni[a['r:id']];
    const xml = percorso ? await zip.testo(percorso) : null;
    if (xml === null) continue;
    fogli.push({ nome: a.name, righe: leggiFoglio(xml, condivise) });
  }
  return fogli;
}

// --- Scrittura ------------------------------------------------------------
//
// Il minimo che Excel apre senza riparazioni: content types, relazioni,
// workbook, stili, un foglio per pilastro. Stringhe inline (niente
// sharedStrings), formule senza valore in cache: Excel le ricalcola
// all'apertura (fullCalcOnLoad).
//
// fogli: [{ nome, colonne: [larghezza, ...], righe: [[cella, ...], ...], convalida? }]
// cella: stringa | numero | null | { v, f, s }   (f = formula, s = stile)
// convalida: { rif: 'E4:E40', min: 0, max: 5 }   intero fra min e max, vuoto ammesso

export const STILE = { normale: 0, titolo: 1, intestazione: 2, testo: 3 };

const xmlEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function lettereDaColonna(col) {
  let s = '';
  for (let n = col + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

// Excel rifiuta nomi di foglio oltre 31 caratteri o con []:*?/\
export function nomeFoglio(nome) {
  return String(nome).replace(/[[\]:*?/\\]/g, ' ').trim().slice(0, 31) || 'Foglio';
}

function cellaXml(cella, rif) {
  if (cella === null || cella === undefined || cella === '') return '';
  const c = typeof cella === 'object' ? cella : { v: cella };
  const s = c.s ? ` s="${c.s}"` : '';
  if (c.f) return `<c r="${rif}"${s}><f>${xmlEsc(c.f)}</f></c>`;
  if (typeof c.v === 'number') return `<c r="${rif}"${s}><v>${c.v}</v></c>`;
  if (c.v === null || c.v === undefined || c.v === '') return s ? `<c r="${rif}"${s}/>` : '';
  return `<c r="${rif}"${s} t="inlineStr"><is><t xml:space="preserve">${xmlEsc(c.v)}</t></is></c>`;
}

function foglioXml(f) {
  const colonne = f.colonne?.length
    ? `<cols>${f.colonne.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols>`
    : '';
  const righe = f.righe.map((riga, r) =>
    `<row r="${r + 1}">${(riga ?? []).map((c, i) => cellaXml(c, `${lettereDaColonna(i)}${r + 1}`)).join('')}</row>`).join('');
  const convalida = f.convalida
    ? `<dataValidations count="1"><dataValidation type="whole" allowBlank="1" showErrorMessage="1" errorTitle="Punteggio" error="Intero da ${f.convalida.min} a ${f.convalida.max}, oppure vuoto se il check non si applica." sqref="${f.convalida.rif}"><formula1>${f.convalida.min}</formula1><formula2>${f.convalida.max}</formula2></dataValidation></dataValidations>`
    : '';
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="3" topLeftCell="A4" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>${colonne}<sheetData>${righe}</sheetData>${convalida}</worksheet>`;
}

const STILI = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="3"><font><sz val="10"/><name val="Arial"/></font><font><b/><sz val="14"/><name val="Arial"/></font><font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Arial"/></font></fonts>
<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1B1D24"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="4">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top"/></xf>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="2" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

export function scriviXlsx(fogli) {
  const T = 'application/vnd.openxmlformats-officedocument.spreadsheetml';
  const R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  const file = {
    '[Content_Types].xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="${T}.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="${T}.styles+xml"/>${
      fogli.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="${T}.worksheet+xml"/>`).join('')}</Types>`,
    '_rels/.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${R}/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    'xl/workbook.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="${R}"><sheets>${
      fogli.map((f, i) => `<sheet name="${xmlEsc(nomeFoglio(f.nome))}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`,
    'xl/_rels/workbook.xml.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${
      fogli.map((_, i) => `<Relationship Id="rId${i + 1}" Type="${R}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')
    }<Relationship Id="rId${fogli.length + 1}" Type="${R}/styles" Target="styles.xml"/></Relationships>`,
    'xl/styles.xml': STILI,
  };
  fogli.forEach((f, i) => { file[`xl/worksheets/sheet${i + 1}.xml`] = foglioXml(f); });
  return creaZip(file);
}
