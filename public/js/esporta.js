// Dalla matrice ai fogli xlsx (ADR-006). Un foglio per pilastro, nella stessa
// forma che matrice.js sa rileggere: titolo «X Performance Matrix», istruzioni,
// intestazione, una riga per check. Risultato e massimo sono formule, così il
// file resta utile anche aperto in Excel. Pura: si testa in Node.

import { STILE, lettereDaColonna } from './xlsx.js';
import { PUNTEGGIO_MAX } from './matrice.js';

export const ISTRUZIONI = `Compilare la colonna Punteggio da 1 a 5: 1 = molto grave o eseguito male, 5 = eseguito da best practice. 0 se l'elemento manca. Lasciare vuoto se il check non si applica al sito (es. hreflang su un sito in una lingua): non entra nel calcolo. Il peso va da 1 a 10.`;

export function matriceInFogli(matrice) {
  return matrice.pilastri.map((p) => {
    const intestazione = [...(p.canale ? ['Canale'] : []), 'Area', 'Check', 'Note', 'Peso', 'Punteggio', 'Risultato', 'Risultato MAX'];
    const col = Object.fromEntries(intestazione.map((h, i) => [h, lettereDaColonna(i)]));
    const righe = [
      [{ v: `${p.nome} Performance Matrix`, s: STILE.titolo }],
      [{ v: ISTRUZIONI, s: STILE.testo }],
      intestazione.map((v) => ({ v, s: STILE.intestazione })),
    ];
    p.voci.forEach((voce, i) => {
      const r = i + 4;
      righe.push([
        ...(p.canale ? [voce.canale] : []),
        { v: voce.area, s: STILE.testo },
        { v: voce.check, s: STILE.testo },
        { v: voce.note, s: STILE.testo },
        voce.peso,
        voce.punteggio,
        { f: `IF(${col.Punteggio}${r}="","",${col.Peso}${r}*${col.Punteggio}${r})` },
        { f: `IF(${col.Punteggio}${r}="","",${col.Peso}${r}*${PUNTEGGIO_MAX})` },
      ]);
    });
    const larghezze = { Canale: 12, Area: 26, Check: 32, Note: 70, Peso: 7, Punteggio: 11, Risultato: 11, 'Risultato MAX': 14 };
    return {
      nome: p.nome,
      colonne: intestazione.map((h) => larghezze[h]),
      righe,
      convalida: { rif: `${col.Punteggio}4:${col.Punteggio}${p.voci.length + 3}`, min: 0, max: PUNTEGGIO_MAX },
    };
  });
}

// «Acme» → «Perf matrix_Acme.xlsx»: clienteDaNomeFile lo rilegge.
export function nomeFileXlsx(cliente) {
  const pulito = String(cliente ?? '').replace(/[\\/:*?"<>|]/g, ' ').trim();
  return pulito ? `Perf matrix_${pulito}.xlsx` : 'Perf matrix_modello.xlsx';
}
