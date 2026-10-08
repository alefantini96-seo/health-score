// Verifiche sul repository, non sul codice dell'applicazione.
// Tengono in piedi le decisioni che altrimenti si erodono senza che nessuno
// se ne accorga: il formato degli ADR, nessuna funzione server e nessuna
// dipendenza (ADR-003), nessun dato cliente (ADR-004).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODELLO } from '../public/js/modello.js';

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..');
const percorso = (...p) => join(RADICE, ...p);

function tuttiIFile(dir = RADICE) {
  const out = [];
  for (const nome of readdirSync(dir)) {
    if (['.git', 'node_modules', '.vercel'].includes(nome)) continue;
    const p = join(dir, nome);
    if (statSync(p).isDirectory()) out.push(...tuttiIFile(p));
    else out.push(relative(RADICE, p).replace(/\\/g, '/'));
  }
  return out;
}

// --- ADR -------------------------------------------------------------------

const DIR_ADR = percorso('docs', 'adr');
const fileAdr = readdirSync(DIR_ADR).filter((f) => f.endsWith('.md')).sort();

test('gli ADR hanno nome NNN-titolo.md e numerazione continua da 001', () => {
  assert.ok(fileAdr.length > 0, 'nessun ADR in docs/adr');
  fileAdr.forEach((nome, i) => {
    assert.match(nome, /^\d{3}-[a-z0-9-]+\.md$/, `nome non conforme: ${nome}`);
    assert.equal(nome.slice(0, 3), String(i + 1).padStart(3, '0'), `buco nella numerazione: ${nome}`);
  });
});

test('ogni ADR ha titolo, data, stato e le sezioni dello schema', () => {
  const sezioni = ['## Contesto', '## Problema', '## Opzioni valutate', '## Decisione', '## Conseguenze', '## Come si ribalta'];
  for (const nome of fileAdr) {
    const testo = readFileSync(join(DIR_ADR, nome), 'utf8');
    const numero = nome.slice(0, 3);
    assert.match(testo, new RegExp(`^# ADR-${numero}: .+`), `${nome}: il titolo deve essere "# ADR-${numero}: ..."`);
    assert.match(testo, /^\*\*Data:\*\* \d{4}-\d{2}-\d{2}$/m, `${nome}: manca "**Data:** aaaa-mm-gg"`);
    assert.match(testo, /^\*\*Stato:\*\* .+$/m, `${nome}: manca "**Stato:**"`);
    for (const s of sezioni) assert.ok(testo.includes(`\n${s}\n`), `${nome}: manca la sezione "${s}"`);
  }
});

test('il README rimanda a ogni ADR', () => {
  const readme = readFileSync(percorso('README.md'), 'utf8');
  for (const nome of fileAdr) assert.ok(readme.includes(`docs/adr/${nome}`), `README non rimanda a ${nome}`);
});

test('docs/aperto.md dichiara la data di aggiornamento e i tre gruppi', () => {
  const testo = readFileSync(percorso('docs', 'aperto.md'), 'utf8');
  assert.match(testo, /^Ultimo aggiornamento: .+$/m);
  for (const g of ['## 1. Aspetta una decisione', '## 2. Aspetta qualcosa di esterno', "## 3. Si può fare quando c'è tempo"]) {
    assert.ok(testo.includes(g), `manca il gruppo "${g}"`);
  }
});

// --- ADR-003 -----------------------------------------------------------------

test('nessuna dipendenza npm e nessuna funzione server', () => {
  const pkg = JSON.parse(readFileSync(percorso('package.json'), 'utf8'));
  assert.equal(pkg.dependencies, undefined);
  assert.equal(pkg.devDependencies, undefined);
  assert.ok(!existsSync(percorso('api')), 'la cartella api/ non deve esistere');
  const conf = JSON.parse(readFileSync(percorso('vercel.json'), 'utf8'));
  assert.equal(conf.outputDirectory, 'public');
  assert.equal(conf.functions, undefined);
});

test('nessuno script esterno caricato dalla pagina', () => {
  const html = readFileSync(percorso('public', 'index.html'), 'utf8');
  assert.doesNotMatch(html, /<script[^>]+src="https?:/);
  assert.doesNotMatch(html, /<link[^>]+href="https?:/);
});

// --- ADR-004 -----------------------------------------------------------------

test('nessun file Excel o CSV nel repository', () => {
  const vietati = tuttiIFile().filter((f) => /\.(xlsx|xls|xlsm|csv)$/i.test(f));
  assert.deepEqual(vietati, []);
});

test('il modello standard non ha punteggi né nomi di foglio', () => {
  for (const p of MODELLO.pilastri) {
    assert.equal(p.foglio, undefined, 'il nome del foglio può essere quello del cliente');
    for (const v of p.voci) assert.equal(v.punteggio, null);
  }
});
