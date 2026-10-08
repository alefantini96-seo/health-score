import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matriceInFogli, nomeFileXlsx } from '../public/js/esporta.js';
import { scriviXlsx, leggiXlsx, nomeFoglio, lettereDaColonna } from '../public/js/xlsx.js';
import { apriZip, crc32 } from '../public/js/zip.js';
import { leggiMatrice, clienteDaNomeFile } from '../public/js/matrice.js';
import { MODELLO } from '../public/js/modello.js';

const v = (area, check, peso, punteggio, note = '') => ({ area, canale: '', check, note, peso, punteggio });

const MATRICE = {
  pilastri: [
    { nome: 'SEO', canale: false, voci: [v('Crawling', 'Robots & <sitemap>', 10, 4, 'riga 1\nriga 2'), v('Crawling', 'Hreflang', 5, null), v('On page', 'Title', 7, 0)] },
    { nome: 'GEO', canale: false, voci: [v('Citabilità', 'Definizione', 9, 5)] },
    { nome: 'Social', canale: true, voci: [{ ...v('Community', 'Moderazione', 8, 3), canale: 'Instagram' }] },
  ],
};

test('esporta e rilegge la stessa matrice: punteggi, vuoti, zeri, note, canale', async () => {
  const letta = leggiMatrice(await leggiXlsx(scriviXlsx(matriceInFogli(MATRICE))));
  assert.deepEqual(letta.avvisi, []);
  assert.deepEqual(letta.pilastri.map(({ foglio, ...p }) => p), MATRICE.pilastri);
});

test('il modello standard sopravvive al giro xlsx', async () => {
  const letta = leggiMatrice(await leggiXlsx(scriviXlsx(matriceInFogli(MODELLO))));
  assert.deepEqual(letta.pilastri.map(({ foglio, ...p }) => p), MODELLO.pilastri);
});

test('il foglio ha titolo, istruzioni, intestazione e formule di risultato', () => {
  const [seo, , social] = matriceInFogli(MATRICE);
  assert.equal(seo.righe[0][0].v, 'SEO Performance Matrix');
  assert.deepEqual(seo.righe[2].map((c) => c.v), ['Area', 'Check', 'Note', 'Peso', 'Punteggio', 'Risultato', 'Risultato MAX']);
  assert.equal(seo.righe[3][5].f, 'IF(E4="","",D4*E4)');
  assert.equal(seo.righe[3][6].f, 'IF(E4="","",D4*5)');
  assert.deepEqual(seo.convalida, { rif: 'E4:E6', min: 0, max: 5 });
  assert.equal(social.righe[2][0].v, 'Canale');
  assert.equal(social.righe[3][6].f, 'IF(F4="","",E4*F4)');
});

test('lo ZIP scritto ha i CRC giusti e le parti che Excel richiede', async () => {
  const bytes = scriviXlsx(matriceInFogli(MATRICE));
  const z = apriZip(bytes);
  for (const parte of ['[Content_Types].xml', '_rels/.rels', 'xl/workbook.xml', 'xl/_rels/workbook.xml.rels', 'xl/styles.xml', 'xl/worksheets/sheet1.xml']) {
    assert.ok(z.nomi.includes(parte), `manca ${parte}`);
  }
  // Prima voce locale: CRC dichiarato = CRC del contenuto.
  const dv = new DataView(bytes.buffer, bytes.byteOffset);
  const lNome = dv.getUint16(26, true);
  const dati = bytes.subarray(30 + lNome, 30 + lNome + dv.getUint32(18, true));
  assert.equal(dv.getUint32(14, true), crc32(dati));
  assert.match(await z.testo('[Content_Types].xml'), /sheet3\.xml/);
});

test('crc32 di riferimento', () => {
  assert.equal(crc32(new TextEncoder().encode('123456789')), 0xcbf43926);
});

test('nomi di foglio e colonne validi per Excel', () => {
  assert.equal(nomeFoglio('SEO / GEO: [test]'), 'SEO   GEO   test');
  assert.equal(nomeFoglio('x'.repeat(40)).length, 31);
  assert.deepEqual([0, 25, 26, 51].map(lettereDaColonna), ['A', 'Z', 'AA', 'AZ']);
});

test('nome del file: il cliente torna indietro all\'import', () => {
  assert.equal(nomeFileXlsx('Acme Spa'), 'Perf matrix_Acme Spa.xlsx');
  assert.equal(clienteDaNomeFile(nomeFileXlsx('Acme Spa')), 'Acme Spa');
  assert.equal(nomeFileXlsx(''), 'Perf matrix_modello.xlsx');
  assert.equal(clienteDaNomeFile(nomeFileXlsx('')), '');
  assert.equal(nomeFileXlsx('A/B'), 'Perf matrix_A B.xlsx');
});
