// Rigenera public/js/modello.js da un xlsx della matrice: tiene pilastri, aree,
// check, note e pesi, toglie i punteggi. Il file letto resta dov'è: non entra
// nel repository (ADR-004).
//
//     C:/dev/tools/node/node.exe scripts/modello-da-xlsx.mjs "percorso/matrice.xlsx"

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { leggiXlsx } from '../public/js/xlsx.js';
import { leggiMatrice } from '../public/js/matrice.js';

const file = process.argv[2];
if (!file) { console.error('Uso: node scripts/modello-da-xlsx.mjs <file.xlsx>'); process.exit(1); }

const { pilastri, avvisi } = leggiMatrice(await leggiXlsx(readFileSync(file)));
for (const a of avvisi) console.warn('avviso:', a);

const modello = {
  pilastri: pilastri.map((p) => ({
    nome: p.nome,
    canale: p.canale,
    voci: p.voci.map(({ punteggio, ...v }) => ({ ...v, punteggio: null })),
  })),
};

const testa = `// Il modello standard della matrice: pilastri, aree, check, note e pesi.
// È la checklist di metodo, senza punteggi e senza dati di clienti (ADR-004).
// Si rigenera da un xlsx compilato con scripts/modello-da-xlsx.mjs.

export const MODELLO = `;
const destinazione = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'js', 'modello.js');
writeFileSync(destinazione, testa + JSON.stringify(modello, null, 2) + ';\n');
console.log(modello.pilastri.map((p) => `${p.nome}: ${p.voci.length} voci`).join('\n'));
