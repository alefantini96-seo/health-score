# Istruzioni per le sessioni di lavoro

Leggi prima il `README.md`: dice cosa fa il tool, come è fatto e dove sta la documentazione. Poi `docs/aperto.md` per sapere cosa è in corso.

Lingua: interfaccia, commenti nel codice, documentazione e messaggi di commit in **italiano**.

## Regole che non si negoziano in sessione

Ognuna ha un ADR. Se un compito sembra richiedere di violarne una, fermati e chiedi: non aggirarla.

- Solo import manuale: niente export di Screaming Frog o Semrush, niente API (ADR-001).
- Il calcolo sta in `calcolo.js` e segue ADR-002. Non si rileggono i valori calcolati dall'Excel.
- Nessun framework, nessuna build, nessuna dipendenza npm. `zip.js`, `xlsx.js`, `matrice.js`, `calcolo.js` e `radar.js` restano puri e girano in Node (ADR-003).
- Nessun dato cliente nel repository: niente xlsx, niente nomi di clienti, test su xlsx sintetici costruiti in memoria (ADR-004).
- Tutto il testo che viene dal file importato passa da `esc()` prima di entrare nel DOM.

## Come si lavora

- Ogni regola di lettura o di calcolo ha un test. I valori attesi si ricavano a mano, non rilanciando il codice.
- `node --test` deve passare prima di ogni commit (il gancio in `.githooks/` lo fa da solo, se installato).
- Una decisione che cambia architettura, perimetro o metodo diventa un ADR nuovo in `docs/adr/`, numerato di seguito, con lo stesso schema. Un ADR superato non si cancella: si aggiorna il suo stato e si rimanda al nuovo.
- Quando chiudi un lavoro, aggiorna `docs/aperto.md`.
- Autore dei commit: `ale.fantini96@gmail.com`, altrimenti Vercel non pubblica.
