// Il modello standard della matrice: un pilastro, SEO & GEO, sette aree che
// sono i sette assi del ragnetto (ADR-007). I criteri per scegliere i check
// restano quelli di ADR-005.
// È la checklist di metodo: aree, check, note e pesi, senza punteggi e senza
// dati di clienti (ADR-004).
//
// Peso 1-10: quanto il check muove il posizionamento o la citazione.
// Si mantiene a mano. scripts/modello-da-xlsx.mjs lo rigenera da un xlsx
// modificato in Excel (es. il modello scaricato dal tool e corretto).

const voce = (area, check, note, peso) => ({ area, canale: '', check, note, peso, punteggio: null });

const CRAWLING = 'Crawling';
const ARCHITETTURA = 'Architettura';
const CWV = 'Core Web Vitals';
const DATI = 'Dati strutturati';
const SEMANTICA = 'Semantica & Contenuto';
const AI = 'Accessibilità AI';
const AUTOREVOLEZZA = 'Autorevolezza e brand';

const VOCI = [
  // Crawling: scansione, rendering e segnali di indicizzazione
  voce(CRAWLING, 'Accesso dei bot',
    'robots.txt non blocca pagine né risorse (CSS, JS, immagini) necessarie al rendering. Nessuna pagina importante dietro login.', 10),
  voce(CRAWLING, 'Copertura dell\'indice',
    'Search Console, report Pagine: pagine indicizzate rispetto alle pagine valide del sito. Cercare pagine importanti escluse e index bloat (URL inutili indicizzati).', 8),
  voce(CRAWLING, 'Rendering per Google',
    'Il Controllo URL di Search Console mostra contenuto e link della pagina renderizzata. Link in <a href>, non affidati a onclick. Se il contenuto c\'è solo dopo il rendering: dipendente da JavaScript.', 7),
  voce(CRAWLING, 'Codici di risposta',
    'Link interni verso 3xx, 4xx, 5xx. Catene e loop di redirect. Soft 404. Un URL inesistente deve restituire un 404 vero.', 6),
  voce(CRAWLING, 'Canonical',
    'Presente, assoluto, autoreferenziale sulle pagine originali. Mai verso URL 3xx, 4xx o noindex. Coerente con sitemap e link interni.', 7),
  voce(CRAWLING, 'Sitemap XML',
    'Solo URL 200, indicizzabili e canonici. Dichiarata in robots.txt e in Search Console. lastmod affidabile.', 5),
  voce(CRAWLING, 'Parità mobile e desktop',
    'Mobile-first indexing: su mobile ci sono gli stessi contenuti principali, gli stessi dati strutturati e gli stessi link interni della versione desktop.', 5),
  voce(CRAWLING, 'Hreflang',
    'Solo siti multilingua: reciprocità, codici lingua e paese validi, x-default, solo verso URL canonici 200. «–» se il sito ha una sola lingua.', 5),

  // Architettura
  voce(ARCHITETTURA, 'Pagine per le keyword strategiche',
    'Esiste una pagina dedicata per ogni cluster di keyword principale del settore. Confronto con le pagine che posizionano i competitor.', 8),
  voce(ARCHITETTURA, 'Profondità e pagine orfane',
    'Pagine strategiche raggiungibili entro 3 clic dalla home. Nessuna pagina importante orfana (presente in sitemap ma senza link interni).', 6),
  voce(ARCHITETTURA, 'Linking contestuale',
    'Link interni nel corpo dei contenuti verso le pagine strategiche, con anchor descrittive. Non solo menu e footer.', 5),
  voce(ARCHITETTURA, 'Navigazione a faccette e parametri',
    'Solo e-commerce e siti grandi: le combinazioni di filtri e i parametri non generano URL indicizzabili né consumano crawl budget. «–» se non si applica.', 5),
  voce(ARCHITETTURA, 'URL e breadcrumb',
    'URL parlanti, gerarchici, univoci (niente varianti di maiuscole o slash). Breadcrumb basate sulla struttura del sito, non sul percorso dell\'utente.', 3),

  // Core Web Vitals
  voce(CWV, 'LCP',
    'Dato di campo CrUX, 75° percentile, mobile. Buono ≤ 2,5 s, scarso > 4 s. Controllare origin_fallback: senza dati sull\'URL PSI restituisce quelli dell\'origine.', 7),
  voce(CWV, 'INP',
    'Dato di campo CrUX, 75° percentile, mobile. Buono ≤ 200 ms, scarso > 500 ms. Cercare script di terze parti e handler lunghi.', 7),
  voce(CWV, 'CLS',
    'Dato di campo CrUX, 75° percentile, mobile. Buono ≤ 0,1, scarso > 0,25. Cause tipiche: immagini senza dimensioni, banner iniettati, font.', 5),
  voce(CWV, 'TTFB e server',
    'Dato di campo CrUX. Buono ≤ 0,8 s. CDN, cache, compressione, HTTP/2 o HTTP/3.', 4),
  voce(CWV, 'Immagini',
    'Formati moderni (WebP, AVIF), dimensioni adeguate al contenitore, width e height dichiarati. L\'immagine LCP non è in lazy load.', 4),

  // Dati strutturati
  voce(DATI, 'Tipi per template',
    'I tipi pertinenti al sito: Organization, BreadcrumbList, Article, Product con Offer, LocalBusiness. FAQPage, HowTo e SearchAction non danno più rich result: non vanno chiesti per la SERP.', 6),
  voce(DATI, 'Validità',
    'Nessun errore sui tipi idonei ai risultati avanzati (Rich Results Test, Search Console).', 5),
  voce(DATI, 'Coerenza con il visibile',
    'Il markup descrive solo ciò che è visibile nella pagina. Il markup ingannevole rischia un\'azione manuale e confonde gli LLM.', 6),
  voce(DATI, 'Organization ed entità',
    'Organization con nome, logo, URL e sameAs verso i profili ufficiali (LinkedIn, Wikidata, social). Autori come Person collegati agli articoli.', 5),

  // Semantica & Contenuto
  voce(SEMANTICA, 'Title e meta description',
    'Title unici, con la keyword principale in testa e coerenti con l\'intento. Meta description unica e pertinente: incide sul CTR, non sul posizionamento.', 7),
  voce(SEMANTICA, 'Heading',
    'Un H1 per pagina, coerente con il title. Gerarchia H2 e H3 senza salti.', 4),
  voce(SEMANTICA, 'Cannibalizzazioni',
    'Search Console: più URL che si alternano sulla stessa query. Contare le query e le impression coinvolte.', 6),
  voce(SEMANTICA, 'Contenuti thin e duplicati',
    'Misurare il corpo unico della pagina, non il word count di Screaming Frog: include menu e footer.', 5),
  voce(SEMANTICA, 'Definizione in apertura',
    'Le pagine chiave aprono con una risposta diretta e autosufficiente nelle prime 40-60 parole, prima di ogni narrazione. Nomina il termine principale.', 8),
  voce(SEMANTICA, 'Struttura citabile',
    'H2 e H3 come domande, paragrafi brevi e autosufficienti. FAQ, tabelle e liste nel testo HTML, non in immagine. Le FAQ servono alla citabilità, non danno rich result.', 6),
  voce(SEMANTICA, 'Freschezza',
    'Data di aggiornamento visibile e reale. Le pagine chiave sono riviste negli ultimi 12 mesi, con contenuto aggiornato e non solo la data.', 4),
  voce(SEMANTICA, 'Rischi di spam policy',
    'Contenuti prodotti in scala senza valore (scaled content abuse), sezioni ospitate di terzi (site reputation abuse), pagine doorway. 5 se assenti.', 6),

  // Accessibilità AI
  voce(AI, 'Bot AI di ricerca in robots.txt',
    'Non bloccati: OAI-SearchBot e ChatGPT-User, PerplexityBot e Perplexity-User, Claude-SearchBot e Claude-User, Bingbot. Bloccare i bot di addestramento (GPTBot, ClaudeBot, Google-Extended) è una scelta di business, non un errore.', 9),
  voce(AI, 'Contenuto senza JavaScript',
    'La maggior parte dei crawler AI non esegue JavaScript: il contenuto deve essere nell\'HTML servito. Un contenuto dipendente da JavaScript per loro non esiste.', 9),
  voce(AI, 'CDN e firewall',
    'CDN e WAF (Cloudflare, Akamai) non rispondono 403 né con una challenge ai bot AI. Verificare con richieste che usano i loro user agent.', 7),
  voce(AI, 'Indicizzazione su Bing',
    'Sito verificato in Bing Webmaster Tools, pagine principali indicizzate. Copilot e ChatGPT search attingono anche all\'indice Bing. IndexNow attivo se il CMS lo supporta.', 5),

  // Autorevolezza e brand: off-site, entità, presenza negli LLM
  voce(AUTOREVOLEZZA, 'Domini referenti',
    'Numero, qualità e andamento dei domini referenti rispetto ai competitor. Anchor di brand prevalenti. Dichiarare il tool (Ahrefs o Semrush) e confrontare solo dati dello stesso tool.', 6),
  voce(AUTOREVOLEZZA, 'Menzioni nelle fonti terze',
    'Il brand compare nelle fonti che gli LLM citano per il settore: stampa, comparatori, Reddit, YouTube, piattaforme di recensioni.', 6),
  voce(AUTOREVOLEZZA, 'Firma e pagine di fiducia',
    'Contenuti firmati da autori reali con bio e competenze. Chi siamo, contatti, sede e policy editoriale raggiungibili e complete.', 5),
  voce(AUTOREVOLEZZA, 'Coerenza dell\'entità',
    'Nome, descrizione e dati aziendali coerenti fra sito, Google Business Profile, Wikipedia, Wikidata e directory. Knowledge panel corretto se presente.', 4),
  voce(AUTOREVOLEZZA, 'Visibilità negli LLM',
    'Peec.AI: quota di risposte che nominano il brand sui prompt del settore e citazioni del dominio come fonte, contro i competitor. Uno 0% su un modello va verificato sulle chat: può essere assenza di risposta, non di visibilità.', 7),
  voce(AUTOREVOLEZZA, 'Correttezza delle risposte AI',
    'Le risposte degli assistenti sul brand sono corrette (prodotti, prezzi, dati) e il tono è neutro o positivo.', 4),
];

export const MODELLO = {
  pilastri: [{ nome: 'SEO & GEO', canale: false, voci: VOCI }],
};
