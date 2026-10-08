// Il modello standard della matrice: pilastri, aree, check, note e pesi.
// È la checklist di metodo, senza punteggi e senza dati di clienti (ADR-004).
// Si rigenera da un xlsx compilato con scripts/modello-da-xlsx.mjs.

export const MODELLO = {
  "pilastri": [
    {
      "nome": "SEO",
      "canale": false,
      "voci": [
        {
          "area": "Crawling",
          "canale": "",
          "check": "I bot sono in grado di scansionare i principali contenuti del sito (il sito è accessibile)?",
          "note": "Verificare che:\n1) non ci siano pagine importanti bloccate dal robots.txt o da login;\n2) non ci siano contenuti realizzati con JS, frame o flash\n3) non siano presenti redirect su pagine importanti \n4) i canonical se presenti siano implementati con un senso\nVerificare che la sitemap XML:\n1) sia strutturata correttamente (index, URL, immagini, video);\n2) riporti gli URL più importanti",
          "peso": 10,
          "punteggio": null
        },
        {
          "area": "Indexing",
          "canale": "",
          "check": "Il numero di contenuti indicizzati è ragionevole rispetto al totale dei contenuti del sito?",
          "note": "Verificare con Site: se il numero di contenuti indicizzati è ragionevole rispetto alle dimensioni del sito (sito molto grande con n. di url dinicizzate molto piccolo -> necessità di ulteriore approfondimento: voto 3)",
          "peso": 3,
          "punteggio": null
        },
        {
          "area": "Struttura e Keyword",
          "canale": "",
          "check": "La struttura del sito è ottimizzata? Esistono pagine per intercettare le principale keyword?",
          "note": "Verificare che la struttura del sito sia adeguata per intercettare la maggior parte delle keyword strategiche. Esistono le pagine essenziali per coprire le kw fondamentali del verticale?",
          "peso": 8,
          "punteggio": null
        },
        {
          "area": "Struttura e Keyword",
          "canale": "",
          "check": "I link interni sono ottimizzati? Vengono sfruttate tutte le opportunità di cross-linking?",
          "note": "Verificare che:\n1) i link interni portino a pagine 200 (Screaming Frog o altri tool)\n2) le pagine interne siano linkate tra loro\n3) le breadcrumb siano presenti su tutte le pagine del sito e che siano di tipo location-based (devono riflettere la struttura del sito, non la navigazione dell'utente)",
          "peso": 3,
          "punteggio": null
        },
        {
          "area": "Struttura e Keyword",
          "canale": "",
          "check": "Gli URL sono SEO-friendly?",
          "note": "Verificare che:\n1) gli URL siano gerarchici, \"parlanti\" e univoci",
          "peso": 4,
          "punteggio": null
        },
        {
          "area": "Struttura e Keyword",
          "canale": "",
          "check": "Le pagine 404 sono gestite correttamente?",
          "note": "Verificare che:\n1) digitando un path casuale o tagliando un URL esistente venga restituito un 404 reale (no soft 404 o redirect)\n2) esista una pagina 404 custom\n3) le pagine 404 mostrino link e barra di ricerca per favorire utenti e bot a proseguire la navigazione",
          "peso": 3,
          "punteggio": null
        },
        {
          "area": "On Page",
          "canale": "",
          "check": "I title tag sono ottimizzati per utenti e motori di ricerca?",
          "note": "Valutare (solo sulle pagine 200 e indicizzabili) la presenza di title tag mancanti, duplicati, multipli o troppo lunghi/corti. Valutare anche il livello di ottimizzazione dei title tag (contengono le keyword principali? hanno contenuto generico? contengono nome brand? presentano keyword stuffing?)",
          "peso": 7,
          "punteggio": null
        },
        {
          "area": "On Page",
          "canale": "",
          "check": "I meta description sono ottimizzati per utenti e motori di ricerca?",
          "note": "Verificare (solo sulle pagine 200 e indicizzabili) la presenza di meta description mancanti, duplicati, multipli o troppo lunghi/corti. Verificare anche l'ottimizzazione dei meta description (contengono le keyword principali? contengono nome brand? contengono CTA? presentano keyword stuffing?)",
          "peso": 3,
          "punteggio": null
        },
        {
          "area": "On Page",
          "canale": "",
          "check": "I tag H1 sono ottimizzati per utenti e motori di ricerca?",
          "note": "Verificare (solo sulle pagine 200 e indicizzabili) la presenza di tag H1 mancanti, duplicati o multipli. Verificare anche l'ottimizzazione dei tag H1 (contengono le keyword principali? presentano keyword stuffing?)",
          "peso": 5,
          "punteggio": null
        },
        {
          "area": "Prestazioni",
          "canale": "",
          "check": "Come risponde il sito a Core web vitals e Mobile Friendly?",
          "note": "",
          "peso": 7,
          "punteggio": null
        }
      ]
    },
    {
      "nome": "Editorial",
      "canale": false,
      "voci": [
        {
          "area": "Longevity",
          "canale": "",
          "check": "Numero pagine blog",
          "note": "Numero di pagine presenti nella sezione Blog",
          "peso": 5,
          "punteggio": null
        },
        {
          "area": "Longevity",
          "canale": "",
          "check": "Numero di nuovi post al mese (giorni)",
          "note": "Ogni quanto vengono pubblicate/aggiornate le news del blog",
          "peso": 7,
          "punteggio": null
        },
        {
          "area": "SEO compliance",
          "canale": "",
          "check": "Scrittura SEO",
          "note": "Verificare se l'area editoriale rispecchia i requisiti SEO di scrittura, tagging etc",
          "peso": 8,
          "punteggio": null
        },
        {
          "area": "SEO compliance",
          "canale": "",
          "check": "Studio keyword",
          "note": "Verificare se è sfruttata la SEO per arricchire i testi con keyword rilevanti",
          "peso": 7,
          "punteggio": null
        },
        {
          "area": "SEO compliance",
          "canale": "",
          "check": "Trending topic",
          "note": "Verificare se sono coperti temi rilevanti e topic di interesse per il target",
          "peso": 6,
          "punteggio": null
        },
        {
          "area": "Commenti",
          "canale": "",
          "check": "Risposta ai commenti dell'articolo",
          "note": "Verificare se la sezione commenti è abilitata: se sì, vengono presi in carico?",
          "peso": 2,
          "punteggio": null
        },
        {
          "area": "Qualità",
          "canale": "",
          "check": "Uso long-form",
          "note": "Verificare se usa contenuti lunghi più di 2000 parole",
          "peso": 3,
          "punteggio": null
        },
        {
          "area": "Qualità",
          "canale": "",
          "check": "Prestigio della firma",
          "note": "Verificare se l'articolo è firmato da giornalista o creator o influencer o SME",
          "peso": 3,
          "punteggio": null
        },
        {
          "area": "Qualità",
          "canale": "",
          "check": "Presenza di rubriche",
          "note": "Verificare presenza di clusterizzazione delle news tramite tag o altri elementi di raggruppamento",
          "peso": 5,
          "punteggio": null
        },
        {
          "area": "Qualità",
          "canale": "",
          "check": "Storytelling",
          "note": "Creazione di storytelling continuativi/aggiornati nel tempo",
          "peso": 3,
          "punteggio": null
        },
        {
          "area": "Visual e brand",
          "canale": "",
          "check": "Personalizzazione creatività",
          "note": "Uso di grafiche o foto interne al blog che sono personalizzate secondo la brand identity dell'azienda",
          "peso": 4,
          "punteggio": null
        },
        {
          "area": "Visual e brand",
          "canale": "",
          "check": "Iconografia",
          "note": "Uso di iconografia personalizzata",
          "peso": 3,
          "punteggio": null
        },
        {
          "area": "Visual e brand",
          "canale": "",
          "check": "Video",
          "note": "Inserimento di video",
          "peso": 3,
          "punteggio": null
        },
        {
          "area": "Visual e brand",
          "canale": "",
          "check": "Tone of voice",
          "note": "Uso di tone of voice coerente con il brand",
          "peso": 8,
          "punteggio": null
        }
      ]
    },
    {
      "nome": "Social",
      "canale": true,
      "voci": [
        {
          "area": "Community Management",
          "canale": "Facebook",
          "check": "Moderazione",
          "note": "Verificare se i commenti di tutti gli utenti sono moderati e con un tone of voice adeguato",
          "peso": 8,
          "punteggio": null
        },
        {
          "area": "Community Management",
          "canale": "Instagram",
          "check": "Moderazione",
          "note": "Verificare se i commenti di tutti gli utenti sono moderati e con un tone of voice adeguato",
          "peso": 8,
          "punteggio": null
        },
        {
          "area": "Community Management",
          "canale": "LinkedIN",
          "check": "Moderazione",
          "note": "Verificare se i commenti di tutti gli utenti sono moderati e con un tone of voice adeguato",
          "peso": 8,
          "punteggio": null
        },
        {
          "area": "Community Management",
          "canale": "Instagram",
          "check": "UGC",
          "note": "Verificare presenza di UGC.\na. cliccando su hashtag di brand\nb. verificando in Stories Highlights il repost di stories/post UGC\nc. verificando le menzioni",
          "peso": 6,
          "punteggio": null
        },
        {
          "area": "Creatività",
          "canale": "Facebook",
          "check": "Post in pagina",
          "note": "Verificare se i contenuti grafici e video sono realizzati secondo best practice:\na. sottotitoli\nb. sound-on\nc. inserimento supra o uso copy-ad\nd. formato vertical o quadrato\ne. lunghezza (15-30sec)",
          "peso": 8,
          "punteggio": null
        },
        {
          "area": "Creatività",
          "canale": "Instagram",
          "check": "Post in pagina",
          "note": "Verificare se i contenuti grafici e video sono realizzati secondo best practice:\na. sottotitoli\nb. sound-on\nc. inserimento supra o uso copy-ad\nd. formato vertical o quadrato\ne. lunghezza (15-30sec)",
          "peso": 8,
          "punteggio": null
        },
        {
          "area": "Creatività",
          "canale": "LinkedIN",
          "check": "Post in pagina",
          "note": "Verificare se i contenuti grafici e video sono realizzati secondo best practice:\na. sottotitoli\nb. sound-on\nc. inserimento supra o uso copy-ad\nd. formato vertical o quadrato\ne. lunghezza (15-30sec)",
          "peso": 8,
          "punteggio": null
        },
        {
          "area": "Creatività",
          "canale": "Instagram",
          "check": "Feed",
          "note": "Il feed è concepito in maniera originale e distintiva, in modo che ogni post contribuisca ad una visione d'insieme unitaria ed effetto. Questo viene solitamente fatto con l'uso di una palette particolare e una pianificazione editoriale che segue un disegno preciso",
          "peso": 10,
          "punteggio": null
        },
        {
          "area": "Creatività",
          "canale": "Instagram",
          "check": "Fotografia",
          "note": "Il brand fa uso di foto originali e produce shooting ad hoc",
          "peso": 6,
          "punteggio": null
        },
        {
          "area": "Creatività",
          "canale": "Facebook",
          "check": "Brand Identity",
          "note": "Verificare se la proposta dei contenuti in pagina è distintiva:\n\nb. uso coerente dei colori di brand\nc. uso di messaggi e leve di comunicazione di brand (es. quote, ispirazionali)\nd. consistenza nell'uso delle emoji\ne. tone of voice personalizzato",
          "peso": 10,
          "punteggio": null
        },
        {
          "area": "Creatività",
          "canale": "Instagram",
          "check": "Brand Identity",
          "note": "Verificare se la proposta dei contenuti in pagina è distintiva:\n\nb. uso coerente dei colori di brand\nc. uso di messaggi e leve di comunicazione di brand (es. quote, ispirazionali)\nd. consistenza nell'uso delle emoji\ne. tone of voice personalizzato",
          "peso": 10,
          "punteggio": null
        },
        {
          "area": "Creatività",
          "canale": "LinkedIN",
          "check": "Brand Identity",
          "note": "Verificare se la proposta dei contenuti in pagina è distintiva:\n\nb. uso coerente dei colori di brand\nc. uso di messaggi e leve di comunicazione di brand (es. quote, ispirazionali)\nd. consistenza nell'uso delle emoji\ne. tone of voice personalizzato",
          "peso": 10,
          "punteggio": null
        },
        {
          "area": "Piano editoriale",
          "canale": "Instagram",
          "check": "Frequenza dei post",
          "note": "Verificare pubblicazione nel feed di contenuti foto o video con regolarità (2 post a settimana)",
          "peso": 7,
          "punteggio": null
        },
        {
          "area": "Piano editoriale",
          "canale": "Facebook",
          "check": "Frequenza dei post",
          "note": "Verificare pubblicazione nel feed di contenuti foto o video con regolarità (1 post a settimana)",
          "peso": 7,
          "punteggio": null
        },
        {
          "area": "Piano editoriale",
          "canale": "LinkedIN",
          "check": "Frequenza dei post",
          "note": "Verificare pubblicazione nel feed di contenuti foto o video con regolarità (2 post a settimana)",
          "peso": 7,
          "punteggio": null
        },
        {
          "area": "Piano editoriale",
          "canale": "Instagram",
          "check": "Stories",
          "note": "Verificare se il brand pubblica stories in modo frequente (3-4 a settimana)",
          "peso": 6,
          "punteggio": null
        },
        {
          "area": "Piano editoriale",
          "canale": "Instagram",
          "check": "Hashtag",
          "note": "Verificare se la pagina utilizza non più di 30 hashtag per post ma almeno 5 rilevanti e almeno 1 branded",
          "peso": 5,
          "punteggio": null
        },
        {
          "area": "Piano editoriale",
          "canale": "Instagram",
          "check": "Differenziazione dei contenuti",
          "note": "Verificare se i contenuti sono concepiti per il canale e differenziati rispetto agli altri social e touchpoint del brand. I contenuti devono rispettare la grammatica, il TOV e l'audience specifica del touchpoint in cui sono realizzati e della modalità con cui l'audience è toccata (owned, earned, paid)",
          "peso": 9,
          "punteggio": null
        },
        {
          "area": "Piano editoriale",
          "canale": "Facebook",
          "check": "Differenziazione dei contenuti",
          "note": "Verificare se i contenuti sono concepiti per il canale e differenziati rispetto agli altri social e touchpoint del brand. I contenuti devono rispettare la grammatica, il TOV e l'audience specifica del touchpoint in cui sono realizzati e della modalità con cui l'audience è toccata (owned, earned, paid)",
          "peso": 9,
          "punteggio": null
        },
        {
          "area": "Piano editoriale",
          "canale": "LinkedIN",
          "check": "Differenziazione dei contenuti",
          "note": "Verificare se i contenuti sono concepiti per il canale e differenziati rispetto agli altri social e touchpoint del brand. I contenuti devono rispettare la grammatica, il TOV e l'audience specifica del touchpoint in cui sono realizzati e della modalità con cui l'audience è toccata (owned, earned, paid)",
          "peso": 9,
          "punteggio": null
        },
        {
          "area": "Maturità della pagina",
          "canale": "Facebook",
          "check": "Pro-pic/cover",
          "note": "Verificare che il logo sia social compliant, ovvero adattato alla forma standard della propic e leggibile; verificare la presenza di cover brandizzata",
          "peso": 8,
          "punteggio": null
        },
        {
          "area": "Maturità della pagina",
          "canale": "Instagram",
          "check": "Pro-pic/cover",
          "note": "Verificare che il logo sia social compliant, ovvero adattato alla forma standard della propic e leggibile; verificare la presenza di cover brandizzata",
          "peso": 8,
          "punteggio": null
        },
        {
          "area": "Maturità della pagina",
          "canale": "LinkedIN",
          "check": "Pro-pic/cover",
          "note": "Verificare che il logo sia social compliant, ovvero adattato alla forma standard della propic e leggibile; verificare la presenza di cover brandizzata",
          "peso": 8,
          "punteggio": null
        },
        {
          "area": "Maturità della pagina",
          "canale": "Instagram",
          "check": "Follower-base",
          "note": "Variabile in base a industry e benchmark competitor",
          "peso": 5,
          "punteggio": null
        },
        {
          "area": "Maturità della pagina",
          "canale": "LinkedIN",
          "check": "Follower-base",
          "note": "Variabile in base a industry e benchmark competitor - il peso non è comunque molto rilevante per LinkedIn",
          "peso": 5,
          "punteggio": null
        },
        {
          "area": "Maturità della pagina",
          "canale": "Facebook",
          "check": "Follower-base",
          "note": "Variabile in base a industry e benchmark competitor - Il peso non è comunque rilevante per Facebook",
          "peso": 5,
          "punteggio": null
        },
        {
          "area": "Maturità della pagina",
          "canale": "Facebook",
          "check": "Chatbot",
          "note": "Uso di chatbot",
          "peso": 3,
          "punteggio": null
        },
        {
          "area": "Maturità della pagina",
          "canale": "Instagram",
          "check": "Chatbot",
          "note": "Uso di chatbot",
          "peso": 3,
          "punteggio": null
        },
        {
          "area": "Maturità della pagina",
          "canale": "Facebook",
          "check": "Shop",
          "note": "Se è un ecommerce, verificare se ha attivato lo shop",
          "peso": 4,
          "punteggio": null
        },
        {
          "area": "Maturità della pagina",
          "canale": "Instagram",
          "check": "Shop",
          "note": "Se è un ecommerce, verificare se ha attivato lo shop",
          "peso": 4,
          "punteggio": null
        },
        {
          "area": "Maturità della pagina",
          "canale": "LinkedIN",
          "check": "Pagina carriera",
          "note": "Verificare se è attiva una pagina Carriera per fornire agli utenti una panoramica dell'organizzazione, della cultura aziendale e delle offerte di lavoro.",
          "peso": 3,
          "punteggio": null
        }
      ]
    },
    {
      "nome": "UX",
      "canale": false,
      "voci": [
        {
          "area": "Velocità",
          "canale": "",
          "check": "Time to First Byte",
          "note": "Time to First Byte con Webpagetest o altri",
          "peso": 10,
          "punteggio": null
        },
        {
          "area": "Velocità",
          "canale": "",
          "check": "Page Speed",
          "note": "Pagespeed insight - mobile",
          "peso": 10,
          "punteggio": null
        },
        {
          "area": "Google Compliance",
          "canale": "",
          "check": "Mobile-friendly",
          "note": "Verificare che il sito sia mobile-friendly (https://search.google.com/test/mobile-friendly)",
          "peso": 9,
          "punteggio": null
        },
        {
          "area": "Google Compliance",
          "canale": "",
          "check": "Navigazione sicura",
          "note": "Verificare che il sito offra una navigazione sicura (https://transparencyreport.google.com/safe-browsing/search)",
          "peso": 9,
          "punteggio": null
        },
        {
          "area": "Google Compliance",
          "canale": "",
          "check": "HTTPS",
          "note": "Verificare che il sito sia in HTTPS e che redirect e link interni puntino a risorse HTTPS",
          "peso": 9,
          "punteggio": null
        },
        {
          "area": "Google Compliance",
          "canale": "",
          "check": "Intrusività",
          "note": "Verificare che il sito mostri popup, banner o interstital non intrusivi",
          "peso": 8,
          "punteggio": null
        },
        {
          "area": "Homepage",
          "canale": "",
          "check": "Brand Identity e positioning",
          "note": "Verificare se la homepage è rappresentativa del brand  e della sua value proposition. \na. presenza del logo\nb. uso coerente dei colori di brand\nc. uso di messaggi e leve di comunicazione di brand\nd. tone of voice personalizzato\ne. consistenza su trattamento fotografico e grafico",
          "peso": 10,
          "punteggio": null
        },
        {
          "area": "Homepage",
          "canale": "",
          "check": "Sito Web",
          "note": "Verificare la presenza di indicazioni sulle diverse funzionalità del sito (cosa posso fare con questo sito/piattaforma?) e che vi siano degli starting point espliciti ai diversi flussi di navigazione possibili (acquisto, richiesta informazioni, contatto, download materiale...).",
          "peso": 9,
          "punteggio": null
        },
        {
          "area": "Scheda prodotto",
          "canale": "",
          "check": "Descrizione del prodotto",
          "note": "Il prodotto è descritto in maniera soddisfacente? Il testo fornisce tutte le informazioni necessarie all'utente per portare a termine il proprio acquisto? Il tov è corretto?",
          "peso": 8,
          "punteggio": null
        },
        {
          "area": "Scheda prodotto",
          "canale": "",
          "check": "Elementi di rassicurazione",
          "note": "Sono presenti elementi di rassicurazione sull'acquisto come ad esempio tempi di spedizione, garanzia, resi e rimborsi? Se sì, hanno il dovuto rilievo in pagina? Le condizioni di acquisto sono chiare o confondono l'utente?",
          "peso": 8,
          "punteggio": null
        },
        {
          "area": "Scheda prodotto",
          "canale": "",
          "check": "Trattamento fotografico",
          "note": "Verificare se le foto prodotto sono quantitativamente sufficienti a rappresentarlo e a fornire una idea esaustiva",
          "peso": 8,
          "punteggio": null
        },
        {
          "area": "Scheda prodotto",
          "canale": "",
          "check": "Trattamento fotografico",
          "note": "Le foto sono distintive rispetto alla brand personality?",
          "peso": 6,
          "punteggio": null
        },
        {
          "area": "Ricerca",
          "canale": "",
          "check": "Ricerca parlante",
          "note": "Verificare che la barra di ricerca non sia vuota: dev'essere sempre presente un testo che invogli l'utente a sfruttare quella funzionalità, ad es: cosa stai cercando?",
          "peso": 4,
          "punteggio": null
        },
        {
          "area": "Ricerca",
          "canale": "",
          "check": "Ricerca aiuto",
          "note": "Verificare che ad ogni ricerce effettuata vi siano non solo i risultati diretti ma anche i suggeriti o i correlati.",
          "peso": 5,
          "punteggio": null
        },
        {
          "area": "Ricerca",
          "canale": "",
          "check": "Stati vuoti",
          "note": "Verificare che il sito sfrutti l'occasione dello stato vuoto per comunicare, suggerendo contenuti interessanti, spingendo alla registrazione al sito o al login, mostrando le ultime ricerche.",
          "peso": 4,
          "punteggio": null
        },
        {
          "area": "Call to action",
          "canale": "",
          "check": "Copy",
          "note": "Valutare quanto ogni call to action riesca a:\n- Anticipare l'outcome dell'azione\n- Interpretare il bisogno dell'utente\n- Adottare il Tone of voice del sito/brand",
          "peso": 7,
          "punteggio": null
        },
        {
          "area": "Menu",
          "canale": "",
          "check": "Menu parlante",
          "note": "Verificare per il menu: \n- Chiarezza del labelling \n- Se e-commerce: uso di leve di marketing (trending, must have, consigliati, preferiti...)\n- Se e-commerce: uso del menu per comunicare anche promo e servizi extra",
          "peso": 7,
          "punteggio": null
        }
      ]
    },
    {
      "nome": "Earned Media",
      "canale": false,
      "voci": [
        {
          "area": "Popularity",
          "canale": "",
          "check": "Trust Flow",
          "note": "Majestic",
          "peso": 5,
          "punteggio": null
        },
        {
          "area": "Popularity",
          "canale": "",
          "check": "Citation Flow",
          "note": "Majestic",
          "peso": 4,
          "punteggio": null
        },
        {
          "area": "Popularity",
          "canale": "",
          "check": "Number of backlinks",
          "note": "Ahrefs",
          "peso": 8,
          "punteggio": null
        },
        {
          "area": "Popularity",
          "canale": "",
          "check": "Number of referring domains dofollow",
          "note": "Ahrefs",
          "peso": 9,
          "punteggio": null
        },
        {
          "area": "Popularity",
          "canale": "",
          "check": "Numero di broken backlinks",
          "note": "Ahrefs",
          "peso": 9,
          "punteggio": null
        }
      ]
    }
  ]
};
