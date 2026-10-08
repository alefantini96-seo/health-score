# Health Score

La Performance Matrix SEO e GEO a ragnetto. Si compila la matrice (in Excel o direttamente nel tool), il tool calcola punteggi per area e per pilastro e disegna i radar. I grafici si scaricano in PNG per il deck, la matrice si esporta in xlsx.

Niente export di Screaming Frog o Semrush, niente API: la matrice è un giudizio esperto e si compila a mano (ADR-001).

**Stato all'8 ottobre 2026:** modello SEO & GEO a sette aree con i check del 2026 (ADR-005, ADR-007), import ed export xlsx (ADR-006), radar, modifica dei punteggi, PNG. 46 test. L'xlsx esportato è verificato in Excel desktop. Da fare: la pubblicazione su Vercel e la prima matrice su un cliente vero (`docs/aperto.md`).

---

## I principi, in una riga ciascuno

| | Principio | ADR |
|---|---|---|
| 1 | Solo import manuale dell'xlsx compilato, o punteggi assegnati nel tool | [001](docs/adr/001-solo-import-manuale.md) |
| 2 | Il calcolo replica l'Excel, ma su tutte le aree: 0 conta, vuoto non entra | [002](docs/adr/002-calcolo-come-excel.md) |
| 3 | Sito statico in JavaScript puro, xlsx letto senza librerie, radar su canvas | [003](docs/adr/003-sito-statico-senza-dipendenze.md) |
| 4 | Nessun dato cliente nel repository, la matrice resta nel browser | [004](docs/adr/004-niente-dati-cliente-nel-repository.md) |
| 5 | Il modello è solo SEO e GEO, con aree allineate al template di audit | [005](docs/adr/005-modello-seo-e-geo.md) |
| 6 | Il tool scrive l'xlsx: modello vuoto ed export della matrice | [006](docs/adr/006-il-tool-scrive-l-xlsx.md) |
| 7 | Un solo ragnetto a sette aree: Crawling, Architettura, CWV, Dati strutturati, Semantica & Contenuto, Accessibilità AI, Autorevolezza e brand | [007](docs/adr/007-un-ragnetto-a-sette-aree.md) |

Prima di cambiare una di queste cose, leggere l'ADR: dice anche come si ribalta.

## Come si usa

1. **Scarica modello xlsx**, compilalo in Excel (Punteggio 0-5, vuoto se il check non si applica) e salvalo come `Perf matrix_<cliente>.xlsx`. Poi **Importa xlsx**.
   In alternativa **Nuova dal modello** e assegni i punteggi direttamente nel tool.
2. La scheda **SEO & GEO** mostra il ragnetto a sette assi, la media, la tabella ottenuto/max per area e i check con la guida «Come si valuta». Peso e punteggio si modificano lì: grafico e medie si aggiornano subito.
3. Se si importa una matrice con più pilastri (es. le vecchie matrici delle gare) compare anche la **Panoramica**.
4. **Scarica PNG** su ogni grafico (1520 × 1280 px, nome del cliente e media nel titolo). **Esporta xlsx** salva la matrice con i punteggi, da archiviare nella cartella del cliente.

L'ultima matrice resta salvata in questo browser. L'archivio vero è l'xlsx.

## Il modello

Un pilastro, SEO & GEO, con sette aree: sono i sette assi del ragnetto.

| Area | Cosa copre | Check |
|---|---|---|
| Crawling | accesso dei bot, indice, rendering per Google, codici di risposta, canonical, sitemap, parità mobile, hreflang | 8 |
| Architettura | pagine per le keyword strategiche, profondità, linking interno, faccette, URL | 5 |
| Core Web Vitals | LCP, INP, CLS di campo, TTFB, immagini | 5 |
| Dati strutturati | tipi per template, validità, coerenza con il visibile, Organization ed entità | 4 |
| Semantica & Contenuto | title, heading, cannibalizzazioni, thin, definizione in apertura, struttura citabile, freschezza, spam policy | 8 |
| Accessibilità AI | bot AI di ricerca, contenuto senza JavaScript, CDN e firewall, Bing | 4 |
| Autorevolezza e brand | domini referenti, menzioni, firma e fiducia, entità, visibilità negli LLM, correttezza delle risposte | 6 |

Check, note e pesi sono in `public/js/modello.js`. I criteri con cui sono scelti sono in ADR-005, le aree in ADR-007.

## Il formato del file

Un foglio per pilastro. Il tool cerca la riga d'intestazione con almeno **Peso** e **Punteggio**, e di solito **Area**, **Check**, **Note** (o **Descrizione**). Può esserci in più la colonna **Canale** (o **Social**).

- Il nome del pilastro viene dal titolo «X Performance Matrix» sopra l'intestazione; se manca, dal nome del foglio.
- Le voci vanno dalla riga dopo l'intestazione alla prima riga senza area e senza check. Quello che sta sotto si ignora.
- I fogli senza quella intestazione si ignorano. Si importano anche le vecchie matrici a cinque pilastri.
- Punteggio: intero 0-5. Vuoto = non applicabile o non compilato. Fuori scala = vuoto, con avviso.

## Il calcolo

| | Formula |
|---|---|
| Risultato voce | peso × punteggio |
| Massimo voce | peso × 5 |
| Quota area | Σ risultati / Σ massimi delle voci compilate |
| Quota pilastro | media semplice delle quote d'area |

Dettagli e differenze con l'Excel delle gare in ADR-002.

## Struttura

```
public/
  index.html, css/app.css
  js/zip.js        lettura e scrittura ZIP
  js/xlsx.js       da xlsx a righe di valori, e ritorno
  js/matrice.js    dalle righe al modello della matrice
  js/calcolo.js    aree, pilastri, medie
  js/esporta.js    dalla matrice ai fogli xlsx
  js/radar.js      geometria del ragnetto (pura)
  js/disegno.js    canvas e PNG
  js/modello.js    checklist SEO & GEO senza punteggi
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
