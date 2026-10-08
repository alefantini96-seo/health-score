// Il modello standard della matrice: due pilastri, SEO e GEO (ADR-005).
// È la checklist di metodo: aree, check, note e pesi, senza punteggi e senza
// dati di clienti (ADR-004). Le aree seguono le sezioni del template di audit
// Alkemy, così ragnetto, deck e checklist usano la stessa tassonomia.
//
// Peso 1-10: quanto il check muove il posizionamento o la citazione.
// Si mantiene a mano. scripts/modello-da-xlsx.mjs lo rigenera da un xlsx
// modificato in Excel (es. il modello scaricato dal tool e corretto).

const voce = (area, check, note, peso) => ({ area, canale: '', check, note, peso, punteggio: null });

const SEO = [
  // Crawling e indicizzazione
  voce('Crawling e indicizzazione', 'Accesso dei bot',
    'robots.txt non blocca pagine né risorse (CSS, JS, immagini) necessarie al rendering. Nessuna pagina importante dietro login.', 10),
  voce('Crawling e indicizzazione', 'Sitemap XML',
    'Solo URL 200, indicizzabili e canonici. Dichiarata in robots.txt e in Search Console. lastmod affidabile. Sitemap index sui siti grandi.', 5),
  voce('Crawling e indicizzazione', 'Copertura dell\'indice',
    'Search Console, report Pagine: pagine indicizzate rispetto alle pagine valide del sito. Cercare pagine importanti escluse e index bloat (URL inutili indicizzati).', 8),
  voce('Crawling e indicizzazione', 'Codici di risposta',
    'Link interni verso 3xx, 4xx, 5xx. Catene e loop di redirect. Soft 404. Un URL inesistente deve restituire un 404 vero.', 6),
  voce('Crawling e indicizzazione', 'Navigazione a faccette e parametri',
    'Solo e-commerce e siti grandi: le combinazioni di filtri e i parametri non generano URL indicizzabili né consumano crawl budget. «–» se non si applica.', 5),

  // Rendering e mobile
  voce('Rendering e mobile', 'Contenuto nell\'HTML servito',
    'Testo principale, link e dati strutturati presenti nel sorgente, senza eseguire JavaScript. Se mancano: contenuto dipendente da JavaScript. Confronto sorgente contro DOM renderizzato.', 9),
  voce('Rendering e mobile', 'Link e paginazione scansionabili',
    'Navigazione, paginazione e filtri usano link <a href>. Niente link affidati a onclick o a contenuti che compaiono solo dopo un\'interazione.', 5),
  voce('Rendering e mobile', 'Parità mobile e desktop',
    'Mobile-first indexing: su mobile ci sono gli stessi contenuti principali, gli stessi dati strutturati e gli stessi link interni della versione desktop.', 6),
  voce('Rendering e mobile', 'HTTPS e interstitial',
    'Tutto in HTTPS, redirect da HTTP, nessun mixed content. Popup e banner non coprono il contenuto principale su mobile.', 4),

  // Architettura e linking interno
  voce('Architettura e linking interno', 'Pagine per le keyword strategiche',
    'Esiste una pagina dedicata per ogni cluster di keyword principale del settore. Confronto con le pagine che posizionano i competitor.', 8),
  voce('Architettura e linking interno', 'Profondità e pagine orfane',
    'Pagine strategiche raggiungibili entro 3 clic dalla home. Nessuna pagina importante orfana (presente in sitemap ma senza link interni).', 6),
  voce('Architettura e linking interno', 'Linking contestuale',
    'Link interni nel corpo dei contenuti verso le pagine strategiche, con anchor descrittive. Non solo menu e footer.', 4),
  voce('Architettura e linking interno', 'URL e breadcrumb',
    'URL parlanti, gerarchici, univoci (niente varianti di maiuscole o slash). Breadcrumb basate sulla struttura del sito, non sul percorso dell\'utente.', 3),

  // Performance e Core Web Vitals
  voce('Performance e Core Web Vitals', 'LCP',
    'Dato di campo CrUX, 75° percentile, mobile. Buono ≤ 2,5 s, scarso > 4 s. Controllare origin_fallback: senza dati sull\'URL PSI restituisce quelli dell\'origine.', 7),
  voce('Performance e Core Web Vitals', 'INP',
    'Dato di campo CrUX, 75° percentile, mobile. Buono ≤ 200 ms, scarso > 500 ms. Cercare script di terze parti e handler lunghi.', 7),
  voce('Performance e Core Web Vitals', 'CLS',
    'Dato di campo CrUX, 75° percentile, mobile. Buono ≤ 0,1, scarso > 0,25. Cause tipiche: immagini senza dimensioni, banner iniettati, font.', 5),
  voce('Performance e Core Web Vitals', 'TTFB e server',
    'Dato di campo CrUX. Buono ≤ 0,8 s. CDN, cache, compressione, HTTP/2 o HTTP/3.', 4),
  voce('Performance e Core Web Vitals', 'Immagini',
    'Formati moderni (WebP, AVIF), dimensioni adeguate al contenitore, width e height dichiarati. L\'immagine LCP non è in lazy load.', 4),

  // Tag e dati strutturati
  voce('Tag e dati strutturati', 'Canonical',
    'Presente, assoluto, autoreferenziale sulle pagine originali. Mai verso URL 3xx, 4xx o noindex. Coerente con sitemap e link interni.', 7),
  voce('Tag e dati strutturati', 'Hreflang',
    'Solo siti multilingua: reciprocità, codici lingua e paese validi, x-default, solo verso URL canonici 200. «–» se il sito ha una sola lingua.', 5),
  voce('Tag e dati strutturati', 'Dati strutturati per template',
    'I tipi pertinenti al sito: Organization, BreadcrumbList, Article, Product con Offer, LocalBusiness. FAQPage, HowTo e SearchAction non danno più rich result: non vanno chiesti per la SERP.', 6),
  voce('Tag e dati strutturati', 'Validità e coerenza con il visibile',
    'Nessun errore sui tipi idonei ai risultati avanzati. Il markup descrive solo ciò che è visibile nella pagina: il markup ingannevole rischia un\'azione manuale.', 6),

  // Contenuti e on-page
  voce('Contenuti e on-page', 'Title',
    'Unici, presenti, con la keyword principale in testa e coerenti con l\'intento. Niente title generici o duplicati sui template.', 7),
  voce('Contenuti e on-page', 'Meta description',
    'Unica e pertinente: incide sul CTR, non sul posizionamento.', 3),
  voce('Contenuti e on-page', 'Heading',
    'Un H1 per pagina, coerente con il title. Gerarchia H2 e H3 senza salti.', 4),
  voce('Contenuti e on-page', 'Cannibalizzazioni',
    'Search Console: più URL che si alternano sulla stessa query. Contare le query e le impression coinvolte.', 6),
  voce('Contenuti e on-page', 'Contenuti thin e duplicati',
    'Misurare il corpo unico della pagina, non il word count di Screaming Frog: include menu e footer.', 5),
  voce('Contenuti e on-page', 'Rischi di spam policy',
    'Contenuti prodotti in scala senza valore (scaled content abuse), sezioni ospitate di terzi (site reputation abuse), pagine doorway. 5 se assenti.', 6),

  // Autorevolezza off-site
  voce('Autorevolezza off-site', 'Domini referenti',
    'Numero e qualità dei domini referenti rispetto ai competitor. Dichiarare il tool (Ahrefs o Semrush) e confrontare solo dati dello stesso tool.', 6),
  voce('Autorevolezza off-site', 'Andamento e anchor',
    'Trend dei domini referenti negli ultimi 12 mesi. Distribuzione delle anchor: brand e URL prevalgono sulle anchor commerciali.', 4),
  voce('Autorevolezza off-site', 'Backlink verso pagine 404',
    'Link esterni che puntano a URL inesistenti: recuperabili con un redirect 301 verso la pagina più pertinente.', 3),
];

const GEO = [
  // Accesso dei crawler AI
  voce('Accesso dei crawler AI', 'Bot AI di ricerca in robots.txt',
    'Non bloccati: OAI-SearchBot e ChatGPT-User, PerplexityBot e Perplexity-User, Claude-SearchBot e Claude-User, Bingbot. Bloccare i bot di addestramento (GPTBot, ClaudeBot, Google-Extended) è una scelta di business, non un errore.', 9),
  voce('Accesso dei crawler AI', 'CDN e firewall',
    'CDN e WAF (Cloudflare, Akamai) non rispondono 403 né con una challenge ai bot AI. Verificare con richieste che usano i loro user agent.', 7),
  voce('Accesso dei crawler AI', 'Contenuto senza JavaScript',
    'La maggior parte dei crawler AI non esegue JavaScript: il contenuto deve essere nell\'HTML servito. Un contenuto dipendente da JavaScript per loro non esiste.', 9),
  voce('Accesso dei crawler AI', 'Indicizzazione su Bing',
    'Sito verificato in Bing Webmaster Tools, pagine principali indicizzate. Copilot e ChatGPT search attingono anche all\'indice Bing. IndexNow attivo se il CMS lo supporta.', 5),

  // Citabilità dei contenuti
  voce('Citabilità dei contenuti', 'Definizione in apertura',
    'Le pagine chiave aprono con una risposta diretta e autosufficiente nelle prime 40-60 parole, prima di ogni narrazione. Nomina il termine principale.', 9),
  voce('Citabilità dei contenuti', 'Passaggi autosufficienti',
    'H2 e H3 formulati come domande. Paragrafi brevi, un concetto ciascuno, comprensibili anche estratti dal contesto.', 6),
  voce('Citabilità dei contenuti', 'FAQ in HTML',
    'Domande e risposte nel testo visibile della pagina: non in immagine, non solo nel JSON-LD. Servono alla citabilità, non danno rich result.', 5),
  voce('Citabilità dei contenuti', 'Tabelle e liste in HTML',
    'Confronti, specifiche e passaggi in tabelle e liste HTML. I dati chiave delle infografiche anche come testo.', 5),

  // Autorevolezza e fonti
  voce('Autorevolezza e fonti', 'Firma autorevole',
    'Contenuti firmati da un autore reale con pagina bio e competenze dichiarate. Person nei dati strutturati, collegato all\'articolo.', 6),
  voce('Autorevolezza e fonti', 'Dati originali e fonti citate',
    'Numeri, studi e statistiche proprie, con fonte e data. Le affermazioni chiave rimandano a fonti verificabili.', 6),
  voce('Autorevolezza e fonti', 'Freschezza',
    'Data di aggiornamento visibile e reale. Le pagine chiave sono riviste negli ultimi 12 mesi, con contenuto aggiornato e non solo la data.', 5),
  voce('Autorevolezza e fonti', 'Pagine di fiducia',
    'Chi siamo, contatti, sede, policy editoriale e privacy raggiungibili e complete.', 4),

  // Entità e brand
  voce('Entità e brand', 'Organization e sameAs',
    'Organization con nome, logo, URL e sameAs verso i profili ufficiali (LinkedIn, Wikidata, social). Stesso nome ovunque.', 5),
  voce('Entità e brand', 'Coerenza delle informazioni',
    'Descrizione, dati aziendali e offerta coerenti fra sito, Google Business Profile, Wikipedia, Wikidata e directory di settore.', 5),
  voce('Entità e brand', 'Knowledge Graph',
    'Il brand ha un knowledge panel o un elemento Wikidata corretto.', 3),

  // Visibilità negli LLM
  voce('Visibilità negli LLM', 'Visibility sul set di prompt',
    'Peec.AI: quota di risposte che nominano il brand sui prompt del settore, contro i competitor. Uno 0% su un modello va verificato sulle chat: può essere assenza di risposta, non di visibilità.', 8),
  voce('Visibilità negli LLM', 'Citazioni del dominio',
    'Il dominio compare come fonte citata in AI Overviews, AI Mode, ChatGPT e Perplexity. Dichiarare modelli e periodo.', 7),
  voce('Visibilità negli LLM', 'Menzioni nelle fonti terze',
    'Il brand compare nelle fonti che gli LLM citano per il settore: stampa, comparatori, Reddit, YouTube, piattaforme di recensioni.', 7),
  voce('Visibilità negli LLM', 'Correttezza e sentiment',
    'Le risposte sul brand sono corrette (prodotti, prezzi, dati) e il tono è neutro o positivo.', 5),
  voce('Visibilità negli LLM', 'Traffico dagli assistenti AI',
    'GA4: sessioni con referral da chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com. Andamento e pagine di atterraggio.', 3),
];

export const MODELLO = {
  pilastri: [
    { nome: 'SEO', canale: false, voci: SEO },
    { nome: 'GEO', canale: false, voci: GEO },
  ],
};
