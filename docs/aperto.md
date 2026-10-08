# Quello che è aperto

Gli ADR dicono che cosa è stato deciso. Questo file dice che cosa resta da fare e soprattutto **perché non è già fatto**, cioè a chi tocca la mossa successiva.

Tre gruppi:

1. **Aspetta una decisione.** Il lavoro è chiaro, la scelta no.
2. **Aspetta qualcosa di esterno.** La decisione c'è, manca un file, un dato o un accesso.
3. **Si può fare quando c'è tempo.** Deciso, sbloccato, non prioritario.

Quando una voce si chiude, si toglie da qui. Se la decisione merita di essere ricordata diventa un ADR, se è lavoro diventa un commit.

Ultimo aggiornamento: 8 ottobre 2026, prima versione.

---

## 1. Aspetta una decisione

### Earned Media senza punteggi

Nel modello i check di Earned Media (Trust Flow, Citation Flow, backlink, referring domains, broken backlinks) non hanno né punteggio né soglie. Nella matrice reale usata per la verifica, la sintesi riportava un 35% scritto a mano. Il tool mostra «n.d.» e mette il vertice al centro.

**La domanda:** si compilano a mano come gli altri pilastri (1-5 a giudizio), o servono soglie dichiarate per trasformare i numeri di Majestic e Ahrefs in punteggi?

### Riportare le modifiche nell'Excel

Oggi i punteggi corretti nel tool restano nel browser (ADR-004). Si può aggiungere l'export della matrice in xlsx o in JSON da reimportare. Va deciso se serve.

### Piano Vercel

Il piano Hobby è per uso non commerciale. È la stessa domanda aperta su `report` e `content`.

## 2. Aspetta qualcosa di esterno

### Prima pubblicazione su Vercel

`vercel.json` è pronto: solo file statici da `public/`, nessuna funzione. La pubblicazione la fa Alessandro collegando il repository a Vercel.

## 3. Si può fare quando c'è tempo

### Confronto con un competitor

Due matrici sovrapposte sullo stesso ragnetto (cliente e competitor, o prima e dopo). Il disegno regge già più serie con poco lavoro; manca il caricamento di una seconda matrice.
