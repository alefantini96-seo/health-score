# ADR-004: Nessun dato cliente nel repository, la matrice resta nel browser

**Data:** 2026-10-08
**Stato:** Approvato. La conseguenza sull'export è aggiornata da ADR-006.

---

## Contesto

Le matrici compilate contengono giudizi su clienti e prospect di gara. Il modello vuoto (check, note, pesi) è invece metodo Alkemy.

## Problema

Che cosa può stare nel repository e dove vive la matrice mentre si lavora?

## Opzioni valutate

| Opzione | Pro | Contro |
|---|---|---|
| **Salvataggio su server o database** | si ritrova da ogni dispositivo | dati cliente fuori dal browser, un servizio da mantenere |
| **Solo browser, ultima matrice in localStorage** | nessun dato esce dal computer | la matrice vive in un solo browser; l'archivio resta l'xlsx |

## Decisione

- Nel repository entra solo il modello vuoto (`public/js/modello.js`): check, note e pesi, punteggi a `null`, nessun nome di cliente. Si rigenera con `scripts/modello-da-xlsx.mjs`, che legge l'xlsx da fuori dal repo.
- I test usano xlsx sintetici costruiti in memoria. `.gitignore` esclude `*.xlsx`.
- Nel browser l'ultima matrice si salva in `localStorage`, solo per comodità: l'archivio vero resta l'xlsx su OneDrive.
- Il repository resta privato: il modello è metodo interno.

## Conseguenze

- Le modifiche fatte nel tool si conservano esportando l'xlsx (ADR-006) e salvandolo nella cartella del cliente. Il file esportato non passa da nessun server.

## Come si ribalta

Se servisse condividere la matrice fra più persone, serve un posto dove salvarla: va deciso con un ADR, insieme a chi può vederla.
