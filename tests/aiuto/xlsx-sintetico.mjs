// Costruisce un .xlsx minimo in memoria, per i test: nessun file binario nel
// repository e nessun dato cliente (ADR-004).
//
// fogli: [{ nome, righe: [[valore, ...], ...] }]
// Le stringhe vanno nelle stringhe condivise, i numeri restano numeri.
// Con { comprimi: true } le voci ZIP sono deflate (come Excel), altrimenti stored.

import { deflateRawSync } from 'node:zlib';

const xmlEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function lettere(col) {
  let s = '';
  for (let n = col + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

const TABELLA_CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = TABELLA_CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function zip(file, { comprimi = false } = {}) {
  const locali = [];
  const centrali = [];
  let offset = 0;
  for (const [nome, contenuto] of Object.entries(file)) {
    const dati = Buffer.from(contenuto, 'utf8');
    const corpo = comprimi ? deflateRawSync(dati) : dati;
    const n = Buffer.from(nome, 'utf8');
    const crc = crc32(dati);
    const loc = Buffer.alloc(30);
    loc.writeUInt32LE(0x04034b50, 0); loc.writeUInt16LE(20, 4); loc.writeUInt16LE(comprimi ? 8 : 0, 8);
    loc.writeUInt32LE(crc, 14); loc.writeUInt32LE(corpo.length, 18); loc.writeUInt32LE(dati.length, 22); loc.writeUInt16LE(n.length, 26);
    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(20, 4); cen.writeUInt16LE(20, 6); cen.writeUInt16LE(comprimi ? 8 : 0, 10);
    cen.writeUInt32LE(crc, 16); cen.writeUInt32LE(corpo.length, 20); cen.writeUInt32LE(dati.length, 24); cen.writeUInt16LE(n.length, 28);
    cen.writeUInt32LE(offset, 42);
    locali.push(loc, n, corpo);
    centrali.push(cen, n);
    offset += 30 + n.length + corpo.length;
  }
  const dirCentrale = Buffer.concat(centrali);
  const fine = Buffer.alloc(22);
  fine.writeUInt32LE(0x06054b50, 0);
  fine.writeUInt16LE(Object.keys(file).length, 8); fine.writeUInt16LE(Object.keys(file).length, 10);
  fine.writeUInt32LE(dirCentrale.length, 12); fine.writeUInt32LE(offset, 16);
  return Buffer.concat([...locali, dirCentrale, fine]);
}

export function xlsx(fogli, opzioni) {
  const condivise = [];
  const indice = new Map();
  const sst = (s) => {
    if (!indice.has(s)) { indice.set(s, condivise.length); condivise.push(s); }
    return indice.get(s);
  };
  const file = {
    '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>',
    'xl/workbook.xml': `<?xml version="1.0" encoding="UTF-8"?><workbook xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${
      fogli.map((f, i) => `<sheet name="${xmlEsc(f.nome)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>`,
    'xl/_rels/workbook.xml.rels': `<?xml version="1.0" encoding="UTF-8"?><Relationships>${
      fogli.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')
    }<Relationship Id="rIdS" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/></Relationships>`,
  };
  fogli.forEach((f, i) => {
    const righe = f.righe.map((riga, r) => {
      const celle = (riga ?? []).map((v, c) => {
        if (v === '' || v === null || v === undefined) return '';
        const rif = `${lettere(c)}${r + 1}`;
        return typeof v === 'number' ? `<c r="${rif}"><v>${v}</v></c>` : `<c r="${rif}" t="s"><v>${sst(String(v))}</v></c>`;
      }).join('');
      return `<row r="${r + 1}">${celle}</row>`;
    }).join('');
    file[`xl/worksheets/sheet${i + 1}.xml`] = `<?xml version="1.0" encoding="UTF-8"?><worksheet><sheetData>${righe}</sheetData></worksheet>`;
  });
  file['xl/sharedStrings.xml'] = `<?xml version="1.0" encoding="UTF-8"?><sst count="${condivise.length}">${condivise.map((s) => `<si><t xml:space="preserve">${xmlEsc(s)}</t></si>`).join('')}</sst>`;
  return zip(file, opzioni);
}
