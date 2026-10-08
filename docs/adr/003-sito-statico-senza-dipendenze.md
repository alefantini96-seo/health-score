# ADR-003: Sito statico in JavaScript puro, xlsx letto senza librerie

**Data:** 2026-10-08
**Stato:** Approvato

---

## Contesto

`report`, `content` e `structured-data-analyzer` sono siti statici in JavaScript puro, senza build né dipendenze npm. Qui serve in più leggere un .xlsx nel browser.

## Problema

Come si legge l'xlsx e con che cosa si disegna il ragnetto?

## Opzioni valutate

| Opzione | Pro | Contro |
|---|---|---|
| **SheetJS + Chart.js da CDN** | pronti | due librerie da tenere aggiornate; SheetJS ha cambiato licenza e canale di distribuzione |
| **Lettore proprio + canvas** | nessuna dipendenza, coerente con gli altri tool | ZIP e XML di Office da leggere a mano |

## Decisione

- `public/js/zip.js` legge la directory centrale dello ZIP e decomprime con `DecompressionStream('deflate-raw')`, nativo nei browser e in Node 18+.
- `public/js/xlsx.js` legge workbook, relazioni, stringhe condivise e fogli con espressioni regolari: l'XML di Office ha una forma fissa, e così lo stesso codice gira in Node senza DOMParser. Si leggono solo i valori, non le formule.
- `public/js/radar.js` fa la geometria (pura, testata), `public/js/disegno.js` disegna su canvas. Il PNG si esporta dal canvas.
- `scripts/server.mjs` serve `public/` in locale. Su Vercel nessuna funzione: solo file statici.

## Conseguenze

- I test girano con `node --test` (`C:/dev/tools/node/node.exe` su questa macchina) e costruiscono gli xlsx in memoria (`tests/aiuto/xlsx-sintetico.mjs`), compressi e non.
- Non si leggono .xls (formato binario) né .ods. Il tool lo dice.

## Come si ribalta

Se servissero formati diversi da .xlsx o grafici più ricchi, si valuta una libreria in `public/vendor/`, come ECharts in `report`.
