import { test } from 'node:test';
import assert from 'node:assert/strict';
import { punto, poligono, allineamento } from '../public/js/radar.js';

const C = { cx: 100, cy: 100, raggio: 50 };
const vicino = (a, b) => a.forEach((x, i) => assert.ok(Math.abs(x - b[i]) < 1e-9, `${a} ≠ ${b}`));

test('il primo asse punta in alto, il secondo di 4 a destra (senso orario)', () => {
  vicino(punto(0, 4, 1, C), [100, 50]);
  vicino(punto(1, 4, 1, C), [150, 100]);
  vicino(punto(2, 4, 0.5, C), [100, 125]);
});

test('quota null va al centro; fuori scala si taglia a 0-1', () => {
  vicino(punto(1, 4, null, C), [100, 100]);
  vicino(punto(1, 4, 1.4, C), [150, 100]);
  vicino(punto(1, 4, -1, C), [100, 100]);
});

test('poligono: un punto per quota', () => {
  assert.equal(poligono([0.2, 0.4, 0.6, 0.8, 1], C).length, 5);
});

test('allineamento delle etichette ai quattro lati', () => {
  assert.deepEqual(allineamento(0, 4), { orizzontale: 'center', verticale: 'bottom' });
  assert.deepEqual(allineamento(1, 4), { orizzontale: 'left', verticale: 'middle' });
  assert.deepEqual(allineamento(2, 4), { orizzontale: 'center', verticale: 'top' });
  assert.deepEqual(allineamento(3, 4), { orizzontale: 'right', verticale: 'middle' });
});
