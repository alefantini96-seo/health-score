// Il ragnetto su canvas. La geometria sta in radar.js, qui solo il disegno.
//
// Stile del template Alkemy: verde 00DA7F per la matrice, Arial, griglia
// grigia. Il riferimento al 100% è l'anello esterno, come la serie «MAX»
// dell'Excel.

import { ANELLI, angolo, poligono, punto, allineamento } from './radar.js';
import { percentuale } from './calcolo.js';

export const COLORI = { serie: '#00DA7F', riempimento: 'rgba(0, 218, 127, 0.28)', griglia: '#D5D8DE', testo: '#1B1D24', tenue: '#6B7280', sfondo: '#FFFFFF' };
const FONT = 'Arial, Helvetica, sans-serif';

// Va a capo sulle parole entro una larghezza massima.
function righeTesto(ctx, testo, larghezza) {
  const parole = testo.split(/\s+/);
  const righe = [];
  let corrente = '';
  for (const p of parole) {
    const prova = corrente ? `${corrente} ${p}` : p;
    if (ctx.measureText(prova).width <= larghezza || !corrente) corrente = prova;
    else { righe.push(corrente); corrente = p; }
  }
  if (corrente) righe.push(corrente);
  return righe;
}

// voci: [{ etichetta, quota }] — quota 0-1 o null.
export function disegnaRadar(canvas, { voci, titolo = '', sottotitolo = '', larghezza = 560, altezza = 480, scala = window.devicePixelRatio || 1 }) {
  canvas.width = Math.round(larghezza * scala);
  canvas.height = Math.round(altezza * scala);
  canvas.style.width = `${larghezza}px`;
  canvas.style.height = `${altezza}px`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(scala, 0, 0, scala, 0, 0);
  ctx.fillStyle = COLORI.sfondo;
  ctx.fillRect(0, 0, larghezza, altezza);

  let alto = 0;
  if (titolo) {
    ctx.fillStyle = COLORI.testo;
    ctx.font = `bold 18px ${FONT}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(titolo, 20, 18);
    alto = 46;
    if (sottotitolo) {
      ctx.font = `13px ${FONT}`;
      ctx.fillStyle = COLORI.tenue;
      ctx.fillText(sottotitolo, 20, 42);
      alto = 66;
    }
  }

  const n = voci.length;
  if (n < 3) {
    ctx.fillStyle = COLORI.tenue;
    ctx.font = `14px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('Servono almeno 3 aree per il ragnetto.', larghezza / 2, alto + (altezza - alto) / 2);
    return;
  }

  const margine = 96;
  const centro = { cx: larghezza / 2, cy: alto + (altezza - alto) / 2, raggio: Math.min(larghezza / 2 - margine - 20, (altezza - alto) / 2 - 44) };

  // Griglia: anelli poligonali e assi.
  ctx.strokeStyle = COLORI.griglia;
  ctx.lineWidth = 1;
  for (const q of ANELLI) {
    ctx.beginPath();
    poligono(Array(n).fill(q), centro).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.stroke();
  }
  for (let i = 0; i < n; i++) {
    const [x, y] = punto(i, n, 1, centro);
    ctx.beginPath();
    ctx.moveTo(centro.cx, centro.cy);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  ctx.fillStyle = COLORI.tenue;
  ctx.font = `10px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  for (const q of ANELLI) ctx.fillText(`${q * 100}%`, centro.cx + 4, centro.cy - centro.raggio * q);

  // Serie.
  const pts = poligono(voci.map((v) => v.quota), centro);
  ctx.beginPath();
  pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = COLORI.riempimento;
  ctx.fill();
  ctx.strokeStyle = COLORI.serie;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fillStyle = COLORI.serie;
  for (const [x, y] of pts) {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Etichette degli assi: nome e quota.
  for (let i = 0; i < n; i++) {
    const a = angolo(i, n);
    const x = centro.cx + Math.cos(a) * (centro.raggio + 14);
    const y = centro.cy + Math.sin(a) * (centro.raggio + 14);
    const { orizzontale, verticale } = allineamento(i, n);
    ctx.font = `bold 13px ${FONT}`;
    const righe = righeTesto(ctx, voci[i].etichetta, margine + 30);
    const blocco = [...righe.map((t) => ({ t, f: `bold 13px ${FONT}`, c: COLORI.testo })), { t: percentuale(voci[i].quota), f: `13px ${FONT}`, c: COLORI.tenue }];
    const h = 16 * blocco.length;
    let y0 = verticale === 'top' ? y : verticale === 'bottom' ? y - h : y - h / 2;
    ctx.textAlign = orizzontale;
    ctx.textBaseline = 'top';
    for (const r of blocco) {
      ctx.font = r.f;
      ctx.fillStyle = r.c;
      ctx.fillText(r.t, x, y0);
      y0 += 16;
    }
  }
}

export function scaricaPng(canvas, nomeFile) {
  canvas.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nomeFile;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }, 'image/png');
}
