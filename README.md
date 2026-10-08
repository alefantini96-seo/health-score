# Health Score

La Performance Matrix a ragnetto. Si importa la matrice compilata in Excel (SEO, Editorial, Social, UX, Earned Media), il tool rifà il calcolo e disegna un radar complessivo e un radar per pilastro. I punteggi si possono anche assegnare o correggere nell'interfaccia, partendo dal modello standard. I grafici si scaricano in PNG per il deck.

Niente export di Screaming Frog o Semrush, niente API: la matrice è un giudizio esperto e si compila a mano (ADR-001).

**Stato all'8 ottobre 2026:** prima versione. Lettore xlsx, calcolo, modello standard, radar, modifica dei punteggi ed export PNG sono fatti e testati. Il calcolo è verificato su una matrice reale. Da fare: la pubblicazione su Vercel (`docs/aperto.md`).

---

## I principi, in una riga ciascuno

| | Principio | ADR |
|---|---|---|
| 1 | Solo import manuale dell'xlsx compilato, o punteggi assegnati nel tool | [001](docs/adr/001-solo-import-manuale.md) |
| 2 | Il calcolo replica l'Excel, ma su tutte le aree: 0 conta, vuoto non entra | [002](docs/adr/002-calcolo-come-excel.md) |
| 3 | Sito statico in JavaScript puro, xlsx letto senza librerie, radar su canvas | [003](docs/adr/003-sito-statico-senza-dipendenze.md) |
| 4 | Nessun dato cliente nel repository, la matrice resta nel browser | [004](docs/adr/004-niente-dati-cliente-nel-repository.md) |

Prima di cambiare una di queste cose, leggere l'ADR: dice anche come si ribalta.

## Come si usa

1. **Importa xlsx** con la matrice compilata, oppure **Nuova dal modello** per partire dalla checklist standard senza punteggi.
2. La scheda **Panoramica** mostra il ragnetto dei cinque pilastri e la media.
3. Ogni scheda di pilastro mostra il ragnetto delle aree, la tabella ottenuto/max e i check. Peso e punteggio si modificano lì: grafico e medie si aggiornano subito.
4. **Scarica PNG** su ogni grafico: 1440 × 1200 px, con nome del cliente e media nel titolo.

L'ultima matrice resta salvata in questo browser. L'archivio vero resta l'xlsx.

## Il formato del file

Un foglio per pilastro. Il tool cerca la riga d'intestazione con almeno **Peso** e **Punteggio**, e di solito **Area**, **Check**, **Note** (o **Descrizione**). Il foglio Social può avere in più la colonna **Social** (o **Canale**).

- Il nome del pilastro viene dal titolo «X Performance Matrix» sopra l'intestazione; se manca, dal nome del foglio.
- Le voci vanno dalla riga dopo l'intestazione alla prima riga senza area e senza check. Il riepilogo che l'Excel tiene più in basso si ignora.
- I fogli senza quella intestazione (es. la sintesi «PERFORMANCE MATRIX») si ignorano.
- Punteggio: intero 0-5. Vuoto = non compilato. Fuori scala = non compilato, con avviso.

## Il calcolo

| | Formula |
|---|---|
| Risultato voce | peso × punteggio |
| Massimo voce | peso × 5 |
| Quota area | Σ risultati / Σ massimi delle voci compilate |
| Quota pilastro | media semplice delle quote d'area |

Dettagli e differenze con l'Excel in ADR-002.

## Struttura

```
public/
  index.html, css/app.css
  js/zip.js        lettura ZIP (DecompressionStream)
  js/xlsx.js       da xlsx a righe di valori
  js/matrice.js    dalle righe al modello della matrice
  js/calcolo.js    aree, pilastri, medie
  js/radar.js      geometria del ragnetto (pura)
  js/disegno.js    canvas e PNG
  js/modello.js    checklist standard senza punteggi (generato)
  js/app.js        interfaccia
scripts/server.mjs          server locale
scripts/modello-da-xlsx.mjs rigenera modello.js da un xlsx
tests/                      node --test
docs/adr/, docs/aperto.md
```

## Lavorarci

```
C:/dev/tools/node/node.exe scripts/server.mjs     → http://localhost:8788
C:/dev/tools/node/node.exe --test
git config core.hooksPath .githooks               (una volta per copia: test prima di ogni commit)
```
