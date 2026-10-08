import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leggiXlsx, leggiFoglio, leggiStringheCondivise, decodifica, colonnaDaLettere } from '../public/js/xlsx.js';
import { apriZip } from '../public/js/zip.js';
import { xlsx, zip } from './aiuto/xlsx-sintetico.mjs';

const FOGLI = [
  { nome: 'Primo', righe: [['Titolo'], [], ['A & B', 3, '', 'fine']] },
  { nome: 'Secondo «è»', righe: [[1.5, 'x']] },
];

for (const comprimi of [false, true]) {
  test(`legge fogli, nomi e valori da uno ZIP ${comprimi ? 'deflate' : 'stored'}`, async () => {
    const fogli = await leggiXlsx(xlsx(FOGLI, { comprimi }));
    assert.deepEqual(fogli.map((f) => f.nome), ['Primo', 'Secondo «è»']);
    assert.deepEqual(fogli[0].righe, [['Titolo'], [], ['A & B', 3, '', 'fine']]);
    assert.deepEqual(fogli[1].righe, [[1.5, 'x']]);
  });
}

test('un file che non è uno ZIP dà un errore leggibile', async () => {
  await assert.rejects(() => leggiXlsx(Buffer.from('non sono un xlsx, solo testo')), /archivio xlsx valido/);
});

test('uno ZIP senza workbook.xml non è un xlsx', async () => {
  await assert.rejects(() => leggiXlsx(zip({ 'a.txt': 'ciao' })), /manca xl\/workbook\.xml/);
});

test('apriZip restituisce null per un file assente', async () => {
  const z = apriZip(zip({ 'a.txt': 'ciao' }));
  assert.deepEqual(z.nomi, ['a.txt']);
  assert.equal(await z.testo('a.txt'), 'ciao');
  assert.equal(await z.testo('b.txt'), null);
});

test('stringhe condivise: frammenti formattati concatenati, guida fonetica ignorata', () => {
  const xml = '<sst><si><t>uno</t></si><si><r><t>du</t></r><r><rPr><b/></rPr><t xml:space="preserve">e </t></r><rPh><t>X</t></rPh></si><si><t/></si></sst>';
  assert.deepEqual(leggiStringheCondivise(xml), ['uno', 'due ', '']);
});

test('celle: stringhe inline, formule con valore in cache, booleani, celle senza riferimento', () => {
  const xml = `<sheetData>
    <row r="2"><c r="B2" t="inlineStr"><is><t>in linea</t></is></c><c r="C2"><f>A1*2</f><v>8</v></c><c r="D2" t="str"><f>"a"</f><v>testo</v></c></row>
    <row r="3"><c t="b"><v>1</v></c><c><v>4</v></c><c r="E3"/></row>
  </sheetData>`;
  assert.deepEqual(leggiFoglio(xml), [[], ['', 'in linea', 8, 'testo'], [true, 4, '', '', '']]);
});

test('decodifica entità XML e caratteri di controllo di Office', () => {
  assert.equal(decodifica('a &amp; b &lt;c&gt; &#233; &#xE8; riga_x000D_'), 'a & b <c> é è riga\r');
});

test('colonne: A=0, Z=25, AA=26, AZ=51', () => {
  assert.deepEqual(['A', 'Z', 'AA', 'AZ'].map(colonnaDaLettere), [0, 25, 26, 51]);
});
