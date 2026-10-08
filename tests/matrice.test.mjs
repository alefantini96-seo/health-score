import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leggiMatrice, clienteDaNomeFile, numero } from '../public/js/matrice.js';

// Un foglio con la forma della matrice: titolo, istruzioni, intestazione,
// voci, righe vuote, riepilogo dell'Excel (da ignorare).
const SEO = {
  nome: 'Cliente X',
  righe: [
    ['', 'SEO Performance Matrix'],
    ['', 'Istruzioni: compilare la colonna Punteggio da 1 a 5...'],
    ['', 'Area', 'Check', 'Note', 'Peso', 'Punteggio ', 'Risultato ', 'Risultato MAX '],
    ['', 'Crawling', 'I bot scansionano?', 'Verificare che:\r\n1) robots', 10, 4, 40, 50],
    ['', 'On Page', 'Title', '', 7, 1, 7, 35],
    ['', 'On Page', 'H1', '', 5, '', '', 25],
    [],
    ['', 'AREA', 'PUNTEGGIO OTTENUTO', 'PUNTEGGIO MAX', 'PUNTEGGIO %'],
    ['', 'Crawling', 40, 50, 0.8],
  ],
};

const SOCIAL = {
  nome: 'Social',
  righe: [
    ['', 'Social Performance Matrix'],
    ['', 'Social', 'Area', 'Check', 'Note', 'Peso', 'Punteggio'],
    ['', 'Facebook', 'Community', 'Moderazione', '', 8, 1],
    ['', 'Instagram', 'Community', 'Moderazione', '', 8, 3],
  ],
};

const PANORAMICA = { nome: 'PERFORMANCE MATRIX', righe: [['The Performance Matrix'], [], ['SEO', 'Editorial'], [0.51, 0.62]] };

test('riconosce i fogli della matrice e ignora gli altri', () => {
  const m = leggiMatrice([PANORAMICA, SEO, SOCIAL]);
  assert.deepEqual(m.ignorati, ['PERFORMANCE MATRIX']);
  assert.deepEqual(m.pilastri.map((p) => p.nome), ['SEO', 'Social']);
  assert.deepEqual(m.avvisi, []);
});

test('il nome del pilastro viene dal titolo, non dal nome del foglio', () => {
  const [seo] = leggiMatrice([SEO]).pilastri;
  assert.equal(seo.nome, 'SEO');
  assert.equal(seo.foglio, 'Cliente X');
});

test('le voci finiscono alla prima riga vuota: il riepilogo dell\'Excel non entra', () => {
  const [seo] = leggiMatrice([SEO]).pilastri;
  assert.equal(seo.voci.length, 3);
  assert.deepEqual(seo.voci[0], { area: 'Crawling', canale: '', check: 'I bot scansionano?', note: 'Verificare che:\n1) robots', peso: 10, punteggio: 4 });
});

test('punteggio vuoto = null (non compilato)', () => {
  const [seo] = leggiMatrice([SEO]).pilastri;
  assert.equal(seo.voci[2].punteggio, null);
});

test('la colonna canale del foglio Social si legge', () => {
  const [social] = leggiMatrice([SOCIAL]).pilastri;
  assert.equal(social.canale, true);
  assert.deepEqual(social.voci.map((v) => v.canale), ['Facebook', 'Instagram']);
});

test('senza titolo «X Performance Matrix» il pilastro prende il nome del foglio', () => {
  const foglio = { nome: 'UX', righe: [['Area', 'Check', 'Peso', 'Punteggio'], ['Menu', 'Menu parlante', 7, 1]] };
  assert.equal(leggiMatrice([foglio]).pilastri[0].nome, 'UX');
});

test('peso non numerico: voce esclusa con avviso; punteggio fuori scala: non compilato con avviso', () => {
  const foglio = { nome: 'F', righe: [['Area', 'Check', 'Peso', 'Punteggio'], ['A', 'uno', 'alto', 3], ['A', 'due', 4, 7], ['A', 'tre', 4, 2.5], ['', 'quattro', 2, 2]] };
  const m = leggiMatrice([foglio]);
  assert.deepEqual(m.pilastri[0].voci.map((v) => [v.check, v.punteggio, v.area]), [['due', null, 'A'], ['tre', null, 'A'], ['quattro', 2, '(senza area)']]);
  assert.equal(m.avvisi.length, 4);
  assert.match(m.avvisi[0], /F, riga 2: peso non numerico/);
  assert.match(m.avvisi[1], /F, riga 3: punteggio «7» fuori scala/);
  assert.match(m.avvisi[3], /F, riga 5: voce senza area/);
});

test('numeri scritti come testo, anche con la virgola', () => {
  assert.equal(numero('4'), 4);
  assert.equal(numero(' 2,5 '), 2.5);
  assert.ok(Number.isNaN(numero('quattro')));
  assert.ok(Number.isNaN(numero('')));
});

test('nome del cliente dal nome del file', () => {
  assert.equal(clienteDaNomeFile('Perf matrix_Acme.xlsx'), 'Acme');
  assert.equal(clienteDaNomeFile('Performance Matrix - Acme Spa.xlsx'), 'Acme Spa');
  assert.equal(clienteDaNomeFile('acme.xlsx'), 'acme');
});
