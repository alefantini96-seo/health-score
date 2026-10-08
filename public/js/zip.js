// Lettura di un archivio ZIP senza librerie: un .xlsx è uno ZIP di file XML.
//
// Si legge la directory centrale in coda all'archivio, poi si decomprime solo
// il file richiesto. Metodi supportati: 0 (stored) e 8 (deflate), gli unici che
// Excel, LibreOffice e Google Sheets usano. La decompressione usa
// DecompressionStream, presente nei browser moderni e in Node 18+ (ADR-003).

const FIRMA_FINE = 0x06054b50;
const FIRMA_CENTRALE = 0x02014b50;
const FIRMA_LOCALE = 0x04034b50;

export function apriZip(buffer) {
  const u8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);

  let fine = -1;
  for (let p = u8.length - 22; p >= Math.max(0, u8.length - 22 - 65535); p--) {
    if (dv.getUint32(p, true) === FIRMA_FINE) { fine = p; break; }
  }
  if (fine < 0) throw new Error('Il file non è un archivio xlsx valido (manca la directory ZIP).');

  const totale = dv.getUint16(fine + 10, true);
  let p = dv.getUint32(fine + 16, true);
  const voci = new Map();
  const utf8 = new TextDecoder('utf-8');

  for (let i = 0; i < totale; i++) {
    if (dv.getUint32(p, true) !== FIRMA_CENTRALE) throw new Error('Directory ZIP danneggiata.');
    const metodo = dv.getUint16(p + 10, true);
    const compresso = dv.getUint32(p + 20, true);
    const lNome = dv.getUint16(p + 28, true);
    const lExtra = dv.getUint16(p + 30, true);
    const lCommento = dv.getUint16(p + 32, true);
    const locale = dv.getUint32(p + 42, true);
    const nome = utf8.decode(u8.subarray(p + 46, p + 46 + lNome));
    voci.set(nome, { metodo, compresso, locale });
    p += 46 + lNome + lExtra + lCommento;
  }

  async function bytes(nome) {
    const v = voci.get(nome);
    if (!v) return null;
    if (dv.getUint32(v.locale, true) !== FIRMA_LOCALE) throw new Error(`Voce ZIP danneggiata: ${nome}`);
    const inizio = v.locale + 30 + dv.getUint16(v.locale + 26, true) + dv.getUint16(v.locale + 28, true);
    const dati = u8.subarray(inizio, inizio + v.compresso);
    if (v.metodo === 0) return dati.slice();
    if (v.metodo !== 8) throw new Error(`Compressione ZIP non supportata (metodo ${v.metodo}) in ${nome}.`);
    const flusso = new Blob([dati]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(flusso).arrayBuffer());
  }

  return {
    nomi: [...voci.keys()],
    bytes,
    async testo(nome) {
      const b = await bytes(nome);
      return b === null ? null : utf8.decode(b);
    },
  };
}
