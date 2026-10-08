// Interfaccia: importa la matrice, la mostra a ragnetto, permette di
// modificare pesi e punteggi. Tutto resta nel browser (ADR-004).

import { leggiXlsx } from './xlsx.js';
import { leggiMatrice, clienteDaNomeFile, PUNTEGGIO_MAX } from './matrice.js';
import { riepilogo, riepilogoPilastro, percentuale, media } from './calcolo.js';
import { disegnaRadar, scaricaPng } from './disegno.js';
import { MODELLO } from './modello.js';

const CHIAVE = 'health-score.matrice';
const $ = (id) => document.getElementById(id);

// Tutto il testo che viene dal file passa da qui prima di entrare nel DOM.
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

let stato = null; // { cliente, pilastri }
let scheda = 'panoramica';

function salva() {
  try { localStorage.setItem(CHIAVE, JSON.stringify(stato)); } catch { /* storage non disponibile: si lavora in memoria */ }
}

function carica() {
  try {
    const s = JSON.parse(localStorage.getItem(CHIAVE));
    return s && Array.isArray(s.pilastri) ? s : null;
  } catch { return null; }
}

function mostraMessaggi(errore, avvisi = []) {
  const el = $('avvisi');
  if (!errore && avvisi.length === 0) { el.innerHTML = ''; return; }
  el.innerHTML = `<div class="messaggio${errore ? ' errore' : ''}">${esc(errore ?? `${avvisi.length} avvisi sulla lettura del file`)}${
    avvisi.length ? `<ul>${avvisi.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}</div>`;
}

function imposta(nuovo) {
  stato = nuovo;
  scheda = 'panoramica';
  salva();
  disegnaTutto();
}

// --- Viste -------------------------------------------------------------------

function vociPanoramica() {
  return riepilogo(stato).map((p) => ({ etichetta: p.nome, quota: p.quota }));
}

function disegnaSchede() {
  const r = riepilogo(stato);
  const voci = [{ id: 'panoramica', nome: 'Panoramica', quota: media(r.map((p) => p.quota)) }, ...r.map((p, i) => ({ id: String(i), nome: p.nome, quota: p.quota }))];
  $('schede').innerHTML = voci.map((v) =>
    `<button type="button" role="tab" data-scheda="${v.id}" aria-selected="${v.id === scheda}">${esc(v.nome)}<span class="quota">${percentuale(v.quota)}</span></button>`).join('');
}

function vistaPanoramica() {
  const r = riepilogo(stato);
  $('vista').innerHTML = `
    <div class="griglia">
      <div class="riquadro">
        <h2>Performance Matrix <button type="button" class="pulsante piccolo" data-png="panoramica">Scarica PNG</button></h2>
        <canvas id="radar"></canvas>
      </div>
      <div class="riquadro">
        <h2>Media dei pilastri</h2>
        <p class="totale">${percentuale(media(r.map((p) => p.quota)))}</p>
        <table>
          <thead><tr><th>Pilastro</th><th class="num">Punteggio</th><th class="num">Voci compilate</th></tr></thead>
          <tbody>${r.map((p) => `
            <tr><td>${esc(p.nome)}<div class="barra"><span style="width:${(p.quota ?? 0) * 100}%"></span></div></td>
            <td class="num">${percentuale(p.quota)}</td><td class="num">${p.compilate} / ${p.voci}</td></tr>`).join('')}
          </tbody>
        </table>
        <p class="legenda">Il punteggio di un pilastro è la media semplice delle sue aree. Un pilastro senza punteggi è «n.d.» e sul ragnetto va al centro.</p>
      </div>
    </div>`;
  disegnaRadar($('radar'), { voci: vociPanoramica() });
}

function tabellaAree(p) {
  return `
    <table>
      <thead><tr><th>Area</th><th class="num">Ottenuto</th><th class="num">Max</th><th class="num">%</th></tr></thead>
      <tbody>${p.aree.map((a) => `
        <tr><td>${esc(a.nome)}<div class="barra"><span style="width:${(a.quota ?? 0) * 100}%"></span></div></td>
        <td class="num">${a.ottenuto}</td><td class="num">${a.massimo}</td><td class="num">${percentuale(a.quota)}</td></tr>`).join('')}
      </tbody>
    </table>`;
}

function opzioniPunteggio(valore) {
  const opzioni = ['<option value="">–</option>'];
  for (let n = 0; n <= PUNTEGGIO_MAX; n++) opzioni.push(`<option value="${n}"${valore === n ? ' selected' : ''}>${n}</option>`);
  return opzioni.join('');
}

function tabellaVoci(indice) {
  const pilastro = stato.pilastri[indice];
  const ordine = [];
  const gruppi = new Map();
  pilastro.voci.forEach((v, i) => {
    const k = v.area.trim().toLowerCase();
    if (!gruppi.has(k)) { gruppi.set(k, []); ordine.push(k); }
    gruppi.get(k).push(i);
  });
  const colCanale = pilastro.canale;
  const colonne = colCanale ? 5 : 4;
  const righe = ordine.map((k) => {
    const elenco = gruppi.get(k);
    return `<tr class="area-riga"><td colspan="${colonne}">${esc(pilastro.voci[elenco[0]].area)}</td></tr>` + elenco.map((i) => {
      const v = pilastro.voci[i];
      return `<tr class="${v.punteggio === null ? 'vuota' : ''}" data-voce="${i}">
        ${colCanale ? `<td>${esc(v.canale)}</td>` : ''}
        <td><div class="check">${esc(v.check)}</div>${v.note ? `<details><summary>Come si valuta</summary><p>${esc(v.note)}</p></details>` : ''}</td>
        <td class="num"><input type="number" min="0" step="1" value="${v.peso}" data-campo="peso" aria-label="Peso"></td>
        <td class="num"><select data-campo="punteggio" aria-label="Punteggio">${opzioniPunteggio(v.punteggio)}</select></td>
        <td class="num" data-risultato>${v.punteggio === null ? '–' : `${v.peso * v.punteggio} / ${v.peso * PUNTEGGIO_MAX}`}</td>
      </tr>`;
    }).join('');
  }).join('');
  return `
    <div class="riquadro voci">
      <h2>Check</h2>
      <table>
        <thead><tr>${colCanale ? '<th>Canale</th>' : ''}<th>Check</th><th class="num">Peso</th><th class="num">Punteggio</th><th class="num">Risultato</th></tr></thead>
        <tbody>${righe}</tbody>
      </table>
      <p class="legenda">Punteggio da 1 (molto grave, eseguito male) a 5 (eseguito da best practice). 0 se la variabile non è presente o verificabile: conta come zero. «–» vuol dire non compilato: la voce non entra nel calcolo.</p>
    </div>`;
}

function vistaPilastro(indice) {
  const p = riepilogoPilastro(stato.pilastri[indice]);
  $('vista').innerHTML = `
    <div class="griglia">
      <div class="riquadro">
        <h2>${esc(p.nome)} <button type="button" class="pulsante piccolo" data-png="${indice}">Scarica PNG</button></h2>
        <canvas id="radar"></canvas>
      </div>
      <div class="riquadro">
        <h2>Media ${esc(p.nome)}</h2>
        <p class="totale" id="totale">${percentuale(p.quota)}</p>
        <div id="aree">${tabellaAree(p)}</div>
      </div>
    </div>
    ${tabellaVoci(indice)}`;
  aggiornaPilastro(indice);
}

// Dopo una modifica si ridisegnano grafico e riepiloghi, non la tabella dei
// check: così il fuoco resta dove l'utente sta scrivendo.
function aggiornaPilastro(indice) {
  const p = riepilogoPilastro(stato.pilastri[indice]);
  disegnaRadar($('radar'), { voci: p.aree.map((a) => ({ etichetta: a.nome, quota: a.quota })) });
  $('totale').textContent = percentuale(p.quota);
  $('aree').innerHTML = tabellaAree(p);
  disegnaSchede();
}

function disegnaTutto() {
  const aperta = stato !== null;
  $('vuoto').hidden = aperta;
  $('lavoro').hidden = !aperta;
  if (!aperta) return;
  $('cliente').value = stato.cliente ?? '';
  disegnaSchede();
  if (scheda === 'panoramica') vistaPanoramica();
  else vistaPilastro(Number(scheda));
}

// --- PNG ---------------------------------------------------------------------

function esportaPng(chi) {
  const canvas = document.createElement('canvas');
  const cliente = stato.cliente?.trim();
  let voci, titolo, sottotitolo, nome;
  if (chi === 'panoramica') {
    voci = vociPanoramica();
    titolo = cliente ? `${cliente} · Performance Matrix` : 'Performance Matrix';
    sottotitolo = `Media dei pilastri ${percentuale(media(voci.map((v) => v.quota)))}`;
    nome = 'Performance Matrix';
  } else {
    const p = riepilogoPilastro(stato.pilastri[Number(chi)]);
    voci = p.aree.map((a) => ({ etichetta: a.nome, quota: a.quota }));
    titolo = cliente ? `${cliente} · ${p.nome}` : p.nome;
    sottotitolo = `Media ${p.nome} ${percentuale(p.quota)}`;
    nome = `${p.nome} Performance Matrix`;
  }
  disegnaRadar(canvas, { voci, titolo, sottotitolo, larghezza: 720, altezza: 600, scala: 2 });
  scaricaPng(canvas, `${nome}${cliente ? ` - ${cliente}` : ''}.png`);
}

// --- Eventi ------------------------------------------------------------------

$('file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const { pilastri, avvisi } = leggiMatrice(await leggiXlsx(await file.arrayBuffer()));
    if (pilastri.length === 0) {
      mostraMessaggi('Nessun foglio con le colonne «Peso» e «Punteggio»: il file non ha la forma della matrice.');
      return;
    }
    mostraMessaggi(null, avvisi);
    imposta({ cliente: clienteDaNomeFile(file.name), pilastri });
  } catch (err) {
    mostraMessaggi(`Il file non si legge: ${err.message}`);
  }
});

$('nuova').addEventListener('click', () => {
  if (stato && !confirm('La matrice aperta verrà sostituita dal modello vuoto. Continuare?')) return;
  mostraMessaggi(null);
  imposta({ cliente: '', pilastri: structuredClone(MODELLO.pilastri) });
});

$('cliente').addEventListener('input', (e) => { stato.cliente = e.target.value; salva(); });

$('schede').addEventListener('click', (e) => {
  const b = e.target.closest('[data-scheda]');
  if (!b) return;
  scheda = b.dataset.scheda;
  disegnaTutto();
});

$('vista').addEventListener('click', (e) => {
  const b = e.target.closest('[data-png]');
  if (b) esportaPng(b.dataset.png);
});

$('vista').addEventListener('change', (e) => {
  const campo = e.target.dataset.campo;
  const riga = e.target.closest('[data-voce]');
  if (!campo || !riga) return;
  const indice = Number(scheda);
  const voce = stato.pilastri[indice].voci[Number(riga.dataset.voce)];
  if (campo === 'peso') {
    const n = Number(e.target.value);
    if (!Number.isFinite(n) || n < 0) { e.target.value = voce.peso; return; }
    voce.peso = n;
  } else {
    voce.punteggio = e.target.value === '' ? null : Number(e.target.value);
    riga.classList.toggle('vuota', voce.punteggio === null);
  }
  riga.querySelector('[data-risultato]').textContent = voce.punteggio === null ? '–' : `${voce.peso * voce.punteggio} / ${voce.peso * PUNTEGGIO_MAX}`;
  salva();
  aggiornaPilastro(indice);
});

stato = carica();
disegnaTutto();
