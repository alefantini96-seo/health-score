import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aree, riepilogoPilastro, riepilogo, media, percentuale } from '../public/js/calcolo.js';
import { MODELLO } from '../public/js/modello.js';

const v = (area, peso, punteggio) => ({ area, canale: '', check: '', note: '', peso, punteggio });

test('quota area = Σ peso×punteggio / Σ peso×5', () => {
  // On Page: 7×1 + 3×1 + 5×1 = 15 su 75 → 20%
  const [a] = aree([v('On Page', 7, 1), v('On Page', 3, 1), v('On Page', 5, 1)]);
  assert.equal(a.ottenuto, 15);
  assert.equal(a.massimo, 75);
  assert.equal(a.quota, 0.2);
});

test('punteggio 0 conta; punteggio vuoto non entra né nel risultato né nel massimo', () => {
  const [a] = aree([v('A', 10, 0), v('A', 10, 5), v('A', 10, null)]);
  assert.equal(a.ottenuto, 50);
  assert.equal(a.massimo, 100);
  assert.equal(a.compilate, 2);
  assert.equal(a.voci, 3);
});

test('le aree si raggruppano ignorando maiuscole e spazi, nell\'ordine in cui compaiono', () => {
  const elenco = aree([v('SEO compliance', 8, 5), v('Qualità', 3, 5), v('SEO  Compliance ', 7, 1)]);
  assert.deepEqual(elenco.map((a) => [a.nome, a.ottenuto, a.massimo]), [['SEO compliance', 47, 75], ['Qualità', 15, 15]]);
});

test('quota pilastro = media semplice delle aree, non media pesata delle voci', () => {
  // A: 10×4 / 50 = 0.8 — B: 1×1 / 5 = 0.2 → media 0.5 (la pesata sarebbe 41/55)
  const p = riepilogoPilastro({ nome: 'X', voci: [v('A', 10, 4), v('B', 1, 1)] });
  assert.equal(p.quota, 0.5);
});

test('aree non compilate restano fuori dalla media; pilastro tutto vuoto = null', () => {
  const p = riepilogoPilastro({ nome: 'X', voci: [v('A', 10, 4), v('B', 5, null)] });
  assert.equal(p.aree[1].quota, null);
  assert.equal(p.quota, 0.8);
  assert.equal(riepilogoPilastro({ nome: 'Y', voci: [v('A', 5, null)] }).quota, null);
});

test('media e percentuale', () => {
  assert.equal(media([0.5, null, 1]), 0.75);
  assert.equal(media([null]), null);
  assert.equal(percentuale(0.514), '51%');
  assert.equal(percentuale(null), 'n.d.');
});

test('il modello standard ha i 5 pilastri, pesi numerici e nessun punteggio', () => {
  assert.deepEqual(MODELLO.pilastri.map((p) => p.nome), ['SEO', 'Editorial', 'Social', 'UX', 'Earned Media']);
  for (const p of MODELLO.pilastri) {
    assert.ok(p.voci.length > 0, p.nome);
    for (const voce of p.voci) {
      assert.equal(voce.punteggio, null);
      assert.ok(Number.isFinite(voce.peso) && voce.peso > 0, `${p.nome}: ${voce.check}`);
    }
  }
  assert.ok(riepilogo(MODELLO).every((p) => p.quota === null));
});
