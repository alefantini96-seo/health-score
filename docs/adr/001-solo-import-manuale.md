# ADR-001: Solo import manuale della matrice compilata

**Data:** 2026-10-08
**Stato:** Approvato

---

## Contesto

Esiste una versione precedente del ragnetto, un artifact di claude.ai, che si alimentava con export di Screaming Frog e Semrush. La Performance Matrix in uso nelle gare e negli audit è invece un giudizio esperto: l'expert reviewer assegna a ogni check un punteggio da 0 a 5.

## Problema

Da dove arrivano i dati del tool?

## Opzioni valutate

| Opzione | Pro | Contro |
|---|---|---|
| **Export SF e Semrush, punteggi derivati dai dati** | meno lavoro manuale | metà dei check (Editorial, Social, UX) non ha un dato di tool; soglie da inventare; un export per ogni gara |
| **Import manuale dell'xlsx compilato, con modifica nel tool** | stesso file che il team già compila, nessuna soglia arbitraria | il punteggio resta un giudizio, non una misura |

## Decisione

Il tool legge solo la matrice compilata a mano: un xlsx con, per ogni pilastro, un foglio con le colonne Area, Check, Note, Peso, Punteggio (vedi `public/js/matrice.js`). In alternativa si parte dal modello standard (`public/js/modello.js`) e si assegnano i punteggi nell'interfaccia. Niente export di SF o Semrush, niente API.

## Conseguenze

- Il formato del file è il contratto. Un foglio è un pilastro se ha l'intestazione con «Peso» e «Punteggio»; gli altri si ignorano e il tool lo dice.
- Il nome del pilastro viene dal titolo «X Performance Matrix» in testa al foglio, perché i fogli a volte portano il nome del cliente (es. il foglio SEO chiamato come il cliente).

## Come si ribalta

Se un pilastro diventasse misurabile con un dato di tool affidabile (es. Earned Media da Ahrefs), si potrà aggiungere un import dedicato per quel pilastro, con soglie dichiarate in un ADR. Il resto resta manuale.
