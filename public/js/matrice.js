// Dalle griglie dei fogli al modello della matrice.
//
// Un foglio è un pilastro se ha una riga d'intestazione con «Peso» e
// «Punteggio». Le voci sono le righe sotto l'intestazione fino alla prima riga
// senza area e senza check. Il riepilogo che l'Excel tiene più in basso si
// ignora: il calcolo lo rifà calcolo.js (ADR-002).
//
// Modello:
//   { pilastri: [{ nome, foglio, canale: bool, voci: [{ area, canale, check, note, peso, punteggio }] }] }
// punteggio è un intero 0-5 oppure null (non compilato).

export const PUNTEGGIO_MAX = 5;

const norm = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();

const COLONNE = {
  area: /^area$/i,
  check: /^check$/i,
  note: /^(note|descrizione)$/i,
  peso: /^peso$/i,
  punteggio: /^punteggio$/i,
  canale: /^(social|canale)$/i,
};

function trovaIntestazione(righe) {
  for (let r = 0; r < righe.length; r++) {
    const cel = (righe[r] ?? []).map(norm);
    const indice = {};
    for (const [chiave, re] of Object.entries(COLONNE)) {
      const i = cel.findIndex((x) => re.test(x));
      if (i >= 0) indice[chiave] = i;
    }
    if (indice.peso !== undefined && indice.punteggio !== undefined) return { riga: r, indice };
  }
  return null;
}

export function numero(v) {
  if (typeof v === 'number') return v;
  const s = norm(v);
  return /^-?\d+([.,]\d+)?$/.test(s) ? Number(s.replace(',', '.')) : NaN;
}

function nomePilastro(righe, finoA, ripiego) {
  for (let r = 0; r < finoA; r++) {
    for (const c of righe[r] ?? []) {
      const m = norm(c).match(/^(.+?)\s+performance\s+matrix$/i);
      if (m) return m[1];
    }
  }
  return ripiego;
}

export function leggiMatrice(fogli) {
  const pilastri = [];
  const avvisi = [];
  const ignorati = [];

  for (const foglio of fogli) {
    const righe = foglio.righe;
    const int = trovaIntestazione(righe);
    if (!int) { ignorati.push(foglio.nome); continue; }
    const { indice } = int;
    const cella = (riga, chiave) => (indice[chiave] === undefined ? '' : (riga[indice[chiave]] ?? ''));
    const nome = nomePilastro(righe, int.riga, foglio.nome);
    const voci = [];

    for (let r = int.riga + 1; r < righe.length; r++) {
      const riga = righe[r] ?? [];
      const area = norm(cella(riga, 'area'));
      const check = norm(cella(riga, 'check'));
      if (!area && !check) break;
      const dove = `${foglio.nome}, riga ${r + 1}`;

      const peso = numero(cella(riga, 'peso'));
      if (!Number.isFinite(peso) || peso < 0) {
        avvisi.push(`${dove}: peso non numerico («${norm(cella(riga, 'peso'))}»), voce esclusa.`);
        continue;
      }

      let punteggio = null;
      const grezzo = cella(riga, 'punteggio');
      if (norm(grezzo) !== '') {
        const n = numero(grezzo);
        if (Number.isInteger(n) && n >= 0 && n <= PUNTEGGIO_MAX) punteggio = n;
        else avvisi.push(`${dove}: punteggio «${norm(grezzo)}» fuori scala 0-${PUNTEGGIO_MAX}, trattato come non compilato.`);
      }

      if (!area) avvisi.push(`${dove}: voce senza area.`);
      voci.push({
        area: area || '(senza area)',
        canale: norm(cella(riga, 'canale')),
        check,
        note: String(cella(riga, 'note') ?? '').replace(/\r\n?/g, '\n').trim(),
        peso,
        punteggio,
      });
    }

    if (voci.length === 0) { avvisi.push(`${foglio.nome}: intestazione trovata ma nessuna voce.`); continue; }
    pilastri.push({ nome, foglio: foglio.nome, canale: indice.canale !== undefined, voci });
  }

  return { pilastri, avvisi, ignorati };
}

// «Perf matrix_Acme.xlsx» → «Acme»
export function clienteDaNomeFile(nome) {
  return nome
    .replace(/\.xlsx$/i, '')
    .replace(/^perf(ormance)?[\s_-]*matrix[\s_-]*/i, '')
    .replace(/[_]+/g, ' ')
    .trim();
}
