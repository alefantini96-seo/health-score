# ADR-006: Il tool scrive l'xlsx: modello vuoto ed export della matrice

**Data:** 2026-10-08
**Stato:** Approvato

---

## Contesto

Con il modello SEO e GEO (ADR-005) non esiste un file Excel da compilare: quello delle gare ha un'altra checklist. E i punteggi assegnati nel tool restavano solo nel browser (ADR-004), senza un modo di riportarli nell'archivio.

## Problema

Come si ottiene il file da compilare, e come si conservano i punteggi assegnati nel tool?

## Opzioni valutate

| Opzione | Pro | Contro |
|---|---|---|
| **Un xlsx modello fatto a mano su OneDrive** | nessun codice | due copie del modello che divergono; il tool non esporta |
| **Export JSON da reimportare** | semplice | un formato in più, che in Excel non si apre |
| **Il tool scrive l'xlsx nella stessa forma che legge** | un solo modello (`modello.js`); il file esportato si riapre in Excel e nel tool | serve uno scrittore xlsx senza librerie |

## Decisione

`scriviXlsx` in `public/js/xlsx.js` e `creaZip` in `public/js/zip.js` scrivono un xlsx minimo: content types, relazioni, stili, un foglio per pilastro. ZIP senza compressione, con CRC-32. Stringhe inline, formule ricalcolate da Excel all'apertura.

`public/js/esporta.js` dispone ogni foglio come lo rilegge `matrice.js`: titolo «X Performance Matrix», istruzioni, intestazione, una riga per check, Risultato e Risultato MAX come formule, convalida 0-5 sul punteggio, intestazione bloccata.

Due pulsanti: **Scarica modello xlsx** (vuoto) ed **Esporta xlsx** (la matrice aperta). Il nome del file è `Perf matrix_<cliente>.xlsx`, da cui l'import ricava il cliente.

## Conseguenze

- Il giro scrittura-lettura è un test: ciò che si esporta si reimporta identico.
- Verificato l'8 ottobre 2026 in Excel desktop: apertura senza riparazioni, formule calcolate, convalida presente.
- `scripts/modello-da-xlsx.mjs` chiude il cerchio: un modello corretto in Excel torna in `modello.js`.

## Come si ribalta

Se servissero grafici nativi o formattazione condizionale nel file, si valuta una libreria in `public/vendor/`. Il lettore resta quello attuale.
