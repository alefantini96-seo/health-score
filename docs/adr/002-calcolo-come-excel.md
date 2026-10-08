# ADR-002: Il calcolo replica l'Excel, su tutte le aree

**Data:** 2026-10-08
**Stato:** Approvato

---

## Contesto

Nell'Excel della matrice ogni voce ha Risultato = Peso × Punteggio e Risultato MAX = Peso × 5. Un SUMIF aggrega per area, la quota d'area è ottenuto/max, la media del pilastro è `AVERAGE` delle quote d'area. Il foglio di sintesi prende le cinque medie e ne fa il radar.

Verifica su una matrice reale compilata (8 ottobre 2026, file fuori dal repository): SEO 51%, Editorial 62%, Social 67% tornano identici. La UX no: l'Excel mostra 68% perché la formula è `AVERAGE(E26:E30)` e salta le prime due aree (Velocità, Google Compliance). Su tutte e sette le aree la media è 66%. Earned Media non ha punteggi e nella sintesi c'è un 35% scritto a mano.

## Problema

Il tool rilegge le formule dell'Excel o rifà il calcolo? E come tratta 0, vuoto e aree mancanti?

## Opzioni valutate

| Opzione | Pro | Contro |
|---|---|---|
| **Leggere i valori calcolati dall'Excel** | identico al file | eredita gli errori di intervallo e i valori scritti a mano; con le modifiche nel tool non si aggiorna |
| **Rifare il calcolo con la stessa regola, su tutte le aree** | un solo metodo, gli errori di formula spariscono | può divergere dall'Excel quando l'Excel sbaglia |

## Decisione

Il tool rifà il calcolo (`public/js/calcolo.js`):

- quota area = Σ peso×punteggio / Σ peso×5, sulle voci compilate;
- quota pilastro = media semplice delle quote d'area (non pesata), su **tutte** le aree compilate;
- punteggio 0 conta come zero, come dice l'istruzione del modello («non presente o verificabile»);
- punteggio vuoto = non compilato: la voce non entra né nel risultato né nel massimo;
- pilastro senza punteggi = «n.d.», non un numero scritto a mano.

Le aree si raggruppano ignorando maiuscole e spazi («SEO compliance» e «SEO Compliance» sono la stessa area, come nel SUMIF).

## Conseguenze

- Su un Excel con una formula sbagliata il tool dà un numero diverso. È voluto: la differenza va segnalata, non replicata.
- La media non pesata fra aree vuol dire che un'area con un solo check pesa quanto una con dieci. È la scelta del modello Excel e si tiene.

## Come si ribalta

Se si decidesse di pesare le aree (es. per numero di check o per peso totale), cambia solo `riepilogoPilastro` e il suo test.
