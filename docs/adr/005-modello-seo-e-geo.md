# ADR-005: Il modello standard è solo SEO e GEO, con i check del 2026

**Data:** 2026-10-08
**Stato:** Approvato

---

## Contesto

La prima versione del modello riprendeva la Performance Matrix usata nelle gare: cinque pilastri (SEO, Editorial, Social, UX, Earned Media), con check SEO fermi a qualche anno fa (Mobile Friendly test, Page Speed come voto unico, nessun dato strutturato, niente AI search). Alessandro ha chiesto un modello solo SEO e GEO, con i punti attuali: Core Web Vitals, dati strutturati, crawler AI.

## Problema

Quali pilastri, aree e check ha il modello, e con quali criteri si scelgono?

## Opzioni valutate

| Opzione | Pro | Contro |
|---|---|---|
| **Tenere i cinque pilastri e aggiornare la SEO** | continuità con le gare passate | Editorial, Social e UX non sono nel perimetro del team |
| **Due pilastri, SEO e GEO, con aree allineate al template di audit** | stesso linguaggio di deck e checklist; ogni area diventa un asse leggibile del ragnetto | i ragnetti nuovi non si confrontano con quelli vecchi a cinque assi |

## Decisione

Due pilastri, in `public/js/modello.js`.

**SEO**, sette aree che seguono le sezioni On-Site e Off-Site del template di audit: Crawling e indicizzazione, Rendering e mobile, Architettura e linking interno, Performance e Core Web Vitals, Tag e dati strutturati, Contenuti e on-page, Autorevolezza off-site.

**GEO**, cinque aree che sviluppano la sezione «Visibilità LLMS & GEO» del template: Accesso dei crawler AI, Citabilità dei contenuti, Autorevolezza e fonti, Entità e brand, Visibilità negli LLM.

Criteri per i check:

- Un check entra se, mancando, blocca scansione o indicizzazione, rischia una penalizzazione, o toglie citazioni dagli LLM. L'igiene che Google gestisce da solo non entra.
- Core Web Vitals sul dato di campo CrUX al 75° percentile, con le soglie di Google (LCP 2,5 s, INP 200 ms, CLS 0,1). La nota ricorda il controllo di `origin_fallback`.
- Dati strutturati: FAQPage, HowTo e SearchAction non danno più rich result e il modello lo dice. Le FAQ restano, nel pilastro GEO, per la citabilità.
- Nei bot AI si distinguono quelli di ricerca (da non bloccare) da quelli di addestramento (scelta di business).
- llms.txt non entra: non è letto da Google e non ha effetti dimostrati.
- La visibilità negli LLM si misura con Peec.AI; uno 0% su un modello va verificato sulle chat prima di leggerlo come assenza.
- Peso da 1 a 10, scelto per impatto. «–» per i check che non si applicano al sito (hreflang su un sito monolingua, faccette fuori dall'e-commerce).

## Conseguenze

- Con due pilastri la panoramica non può avere un asse per pilastro: il ragnetto della panoramica mostra tutte le aree, con le etichette colorate per pilastro. Con tre o più pilastri (es. una vecchia matrice importata) torna un asse per pilastro.
- Le matrici vecchie a cinque pilastri si importano ancora: il lettore non dipende dal modello.
- I check vanno rivisti quando cambia una regola di Google o un comportamento dei crawler AI. Le date di verifica stanno nella memoria di lavoro, non nel modello.

## Come si ribalta

Aggiungere un pilastro (es. Local SEO) vuol dire aggiungere un blocco in `modello.js`: lettore, calcolo ed export non cambiano. Se i pilastri tornano almeno tre, la panoramica torna da sola a un asse per pilastro.
