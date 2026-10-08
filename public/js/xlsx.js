// Da un file .xlsx a una griglia di valori per ogni foglio.
//
// Si leggono solo i valori delle celle, non le formule né gli stili: il calcolo
// lo rifà il tool (ADR-002). L'XML di Office ha una forma fissa e lo si legge
// con espressioni regolari, così lo stesso codice gira nel browser e in Node
// senza DOMParser (ADR-003).

import { apriZip } from './zip.js';

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
