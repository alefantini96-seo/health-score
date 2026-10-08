// Geometria del ragnetto, senza canvas: si testa in Node.
//
// Gli assi partono dall'alto e girano in senso orario, come nel grafico radar
// di Excel. Il valore è una quota 0-1; null (non compilato) va al centro.

export const ANELLI = [0.2, 0.4, 0.6, 0.8, 1];

export function angolo(i, n) {
  return -Math.PI / 2 + (2 * Math.PI * i) / n;
}

export function punto(i, n, quota, { cx, cy, raggio }) {
  const q = Math.max(0, Math.min(1, quota ?? 0));
  const a = angolo(i, n);
  return [cx + Math.cos(a) * raggio * q, cy + Math.sin(a) * raggio * q];
}

export function poligono(quote, centro) {
  return quote.map((q, i) => punto(i, quote.length, q, centro));
}

// Allineamento dell'etichetta in base al lato in cui cade l'asse.
export function allineamento(i, n) {
  const x = Math.cos(angolo(i, n));
  const y = Math.sin(angolo(i, n));
  return {
    orizzontale: Math.abs(x) < 0.15 ? 'center' : x > 0 ? 'left' : 'right',
    verticale: Math.abs(y) < 0.15 ? 'middle' : y > 0 ? 'top' : 'bottom',
  };
}
