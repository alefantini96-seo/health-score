// Il calcolo della matrice, lo stesso dell'Excel (ADR-002).
//
//   risultato voce   = peso × punteggio
//   massimo voce     = peso × 5
//   quota area       = Σ risultati / Σ massimi delle voci compilate
//   quota pilastro   = media semplice delle quote delle aree
//
// Punteggio 0 conta come 0 (è la regola del modello: «non presente o non
// verificabile»). Punteggio vuoto vuol dire non compilato: la voce non entra
// né nel risultato né nel massimo.

import { PUNTEGGIO_MAX } from './matrice.js';

const chiave = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();

export function aree(voci) {
  const mappa = new Map();
  for (const v of voci) {
    const k = chiave(v.area);
    if (!mappa.has(k)) mappa.set(k, { nome: v.area, ottenuto: 0, massimo: 0, voci: 0, compilate: 0 });
    const a = mappa.get(k);
    a.voci++;
    if (v.punteggio === null) continue;
    a.compilate++;
    a.ottenuto += v.peso * v.punteggio;
    a.massimo += v.peso * PUNTEGGIO_MAX;
  }
  return [...mappa.values()].map((a) => ({ ...a, quota: a.massimo > 0 ? a.ottenuto / a.massimo : null }));
}

export function media(valori) {
  const validi = valori.filter((x) => x !== null);
  return validi.length ? validi.reduce((s, x) => s + x, 0) / validi.length : null;
}

export function riepilogoPilastro(pilastro) {
  const elenco = aree(pilastro.voci);
  return {
    nome: pilastro.nome,
    aree: elenco,
    quota: media(elenco.map((a) => a.quota)),
    voci: pilastro.voci.length,
    compilate: pilastro.voci.filter((v) => v.punteggio !== null).length,
  };
}

export function riepilogo(matrice) {
  return matrice.pilastri.map(riepilogoPilastro);
}

export function percentuale(quota) {
  return quota === null ? 'n.d.' : `${Math.round(quota * 100)}%`;
}
