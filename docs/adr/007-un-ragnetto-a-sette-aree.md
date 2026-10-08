# ADR-007: Un solo ragnetto a sette aree

**Data:** 2026-10-08
**Stato:** Approvato

---

## Contesto

ADR-005 aveva diviso il modello in due pilastri, SEO con sette aree e GEO con cinque: dodici assi nella panoramica. Alessandro ha chiesto al massimo sei o sette aree, e ha indicato Crawling, Architettura, CWV, Semantica & Contenuto, Accessibilità AI, più qualcos'altro di rilevante.

## Problema

Quali sette aree, e come si organizza il modello perché ogni area sia un asse leggibile?

## Opzioni valutate

| Opzione | Pro | Contro |
|---|---|---|
| **Due pilastri SEO e GEO, sette aree in tutto** | si tiene la distinzione SEO/GEO | GEO resta con due aree: il suo ragnetto non si disegna (servono almeno 3 assi) |
| **Un pilastro SEO & GEO con sette aree** | un ragnetto, sette assi, ognuno leggibile in slide; i check GEO stanno dove agiscono | non c'è più una media SEO separata da una media GEO |

## Decisione

Un pilastro, «SEO & GEO», con sette aree in quest'ordine:

1. **Crawling**: accesso dei bot, copertura dell'indice, rendering per Google, codici di risposta, canonical, sitemap, parità mobile, hreflang.
2. **Architettura**: pagine per le keyword strategiche, profondità e orfane, linking contestuale, faccette e parametri, URL e breadcrumb.
3. **Core Web Vitals**: LCP, INP, CLS di campo, TTFB, immagini.
4. **Dati strutturati**: tipi per template, validità, coerenza con il visibile, Organization ed entità. Aggiunta: Alessandro l'aveva indicato fra i punti attuali.
5. **Semantica & Contenuto**: on-page, cannibalizzazioni, thin, e i check di citabilità GEO (definizione in apertura, struttura citabile, freschezza), più i rischi di spam policy.
6. **Accessibilità AI**: bot AI di ricerca, contenuto senza JavaScript, CDN e firewall, indicizzazione su Bing.
7. **Autorevolezza e brand**: domini referenti, menzioni nelle fonti terze, firma e pagine di fiducia, coerenza dell'entità, visibilità negli LLM, correttezza delle risposte. Aggiunta: è l'area che spiega i gap competitivi, che non si risolvono scrivendo, e vale per SEO e GEO insieme.

I check scendono da 51 a 40. Fuori: HTTPS e interstitial (igiene, quasi sempre a posto), backlink verso 404 (intervento, non stato di salute), check doppi fra SEO e GEO (il contenuto nell'HTML servito sta solo in Accessibilità AI; per Google resta «Rendering per Google»).

Con un solo pilastro l'app non mostra la panoramica: si apre direttamente il ragnetto del pilastro. Con più pilastri (matrici importate) la panoramica torna.

## Conseguenze

- Un ragnetto da sette assi con etichette brevi, adatto a una slide.
- La media del pilastro è la media semplice delle sette aree (ADR-002): ogni area pesa uguale nel punteggio complessivo.
- I criteri per scegliere i check restano quelli di ADR-005.

## Come si ribalta

Si cambia il blocco `VOCI` in `public/js/modello.js` e il test sull'elenco delle aree. Se si tornasse a due pilastri, ciascuno deve avere almeno tre aree.
