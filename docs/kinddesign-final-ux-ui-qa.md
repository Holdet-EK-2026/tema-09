# KindDesign – afsluttende UX/UI-audit og QA

10. november 2026 · Lokal branch `feature/ux-ui-final-qa`, startet fra `895b58e` med ren working tree. Opgaven omfatter lokale forbedringer, tests og commits. Ingen push, merge, deployment, database- eller rettighedsændring er udført i denne opgave.

## Resultat og status

Autoplay-fejlen er reproduceret, forklaret og rettet. Carousellen har skiftet mindst to gange automatisk i **reel Chrome-tid** ved 390, 768 og 1440 px. FAQ-accordion, navigation, interaktioner og indholdsoprydning er implementeret. Den eksisterende Astro-arkitektur, fonte, farver og autentiske fotografier er bevaret. Der er ingen nye applikationsdependencies.

| Status | Leverance |
| --- | --- |
| Implementeret og verificeret | Carousel-autoplay, cirkulær navigation, kompakte pile/slidevisning/pause-play, hover/fokus/pointer/fanesynlighed/reduced-motion, geninitialisering og oprydning |
| Implementeret og verificeret | FAQ med ét åbent svar, ARIA-tilknytning, Enter/Space, animation og statisk fallback uden JavaScript |
| Implementeret og verificeret | Aktiv navigation, understregning på hover/fokus, fælles interaktionsstates og synlige tastaturmarkeringer |
| Implementeret og verificeret | Fjernet medlemskort-promovering, demooversigt og interne noter; bevaret faktuelt indhold og responsive tekstalternativer |
| Verificeret | Production build, statiske tests, fuld Playwright-pakke, axe, screenshots, Lighthouse og Netlify-offline-build |
| Ikke implementeret i denne opgave | Kontaktbackend, medlemskonto, databaseintegration, automatisk Luma-synkronisering og nye produktfunktioner |
| Eksternt afgrænset | Ingen rigtig reservation/afsendelse; produktion og GitHub er ikke opdateret med disse lokale ændringer |

## Forberedelse og kildegrundlag

`docs/fase-1-rapport.md`, `docs/fase-2-6-rapport.md`, `docs/dokumentation.md`, publiceringsrapporten og eksisterende komponenter/tests blev læst. Den lokale runtime svarede til den publicerede version: HTML for Forside, Events, Ny her, Om og Kontakt var byteidentisk med Netlify før ændringerne. `895b58e` tilføjede dokumentation til den tidligere publicerede kode `b744631`. [Sammenligning](qa/ux-ui-final/before/local-live-comparison.json).

Browser-plugin med en `browser`-skill var ikke tilgængeligt (**Browser plugin not available**); derfor blev projektets eksisterende Playwright 1.65.0, installerede Chrome, axe 4.14.0 og Lighthouse 13.6.0 brugt. Node 22.23.4 og QA-værktøjer ligger isoleret under `/tmp/kinddesign-tools`. Preview: `http://127.0.0.1:4321`. Der er testet production-output fra `dist`.

Primær testrejse: Forside → automatisk carousel uden carousel-input → Events/filtre → eventdetaljer → verificeret Luma-destination. Supplerende rejser: Ny her → FAQ med tastatur; Kalender → måned/event/ICS; Kontakt → fejl → ærlig demobekræftelse → reset. Luma-booking blev ikke gennemført.

Figma blev tilgået read-only med designkontekst og screenshots: [Forside `753:847`](https://www.figma.com/design/upaKrrIg3bRBgo4Md8s12F/Prototype---Tema-9?node-id=753-847), [Events `776:1747`](https://www.figma.com/design/upaKrrIg3bRBgo4Md8s12F/Prototype---Tema-9?node-id=776-1747), [Om `776:1817`](https://www.figma.com/design/upaKrrIg3bRBgo4Md8s12F/Prototype---Tema-9?node-id=776-1817), [Kontakt `776:1873`](https://www.figma.com/design/upaKrrIg3bRBgo4Md8s12F/Prototype---Tema-9?node-id=776-1873), [Ny her `753:1053`](https://www.figma.com/design/upaKrrIg3bRBgo4Md8s12F/Prototype---Tema-9?node-id=753-1053), Ny her mobil `757:2779` og Om mobil `776:1988`. De eksisterende fulde referenceeksporter i `docs/qa/fase-3/references` er bevaret. Ingen Figma-fil blev ændret.

## Prioriteret audit

Fundene nedenfor er konkrete observationer; der er ikke fjernet indhold alene efter et tekstudtræk.

| ID / prioritet | Side / komponent | Problem og konsekvens | Evidens / sikkerhed | Rettelse og status |
| --- | --- | --- | --- | --- |
| UX01 · kritisk | Forside / carousel | Hover på hele sektionen, inklusive intro/blank plads, holder timeren på pause. En almindelig scroll efterlader markøren over introen; billederne står stille. | Reproduceret både lokalt og live: indeks 0 → 0 efter 9,7 s, hover=true, fokus=false, reduced-motion=false, ingen JS-fejl. [Førmåling](qa/ux-ui-final/before/autoplay-baseline.json). | Hover afgrænset til billedvinduet. Synlighed måles på dette vindue. Reel autoplay og pausetilstande verificeret. |
| UX02 · høj | Carousel / betjening | Der var ingen synlig pause/play eller manuel pilebetjening efter den tidligere, særskilt ønskede fjernelse af kontrolrækken. Det opfylder ikke den nye opgaves krav til automatisk bevægelse. | Før-screenshot og browser-DOM; tidligere ændring var tilsigtet, ikke en skjult regression. | Kompakt kontrol i billedvinduet: forrige, position, næste og pause/play. Den gamle brede række med tekst/prikker er ikke genindført. |
| UX03 · mellem | Ny her / FAQ | Svar vises altid; spørgsmålene kan ikke åbnes/lukkes som ønsket. | Browser og Figma før-screenshot. | Native knapper, ét åbent panel, plus/minus, ARIA og 240 ms animation. Verificeret ved alle tre bredder. |
| UX04 · mellem | Global navigation | Forsidens aktive link og Ny her-CTA er ikke lige så tydeligt markerede som almindelige links på undersider. Hoverfeedback mangler. | Browser før-/efter og CSS-inspektion. | Understregning på tekst, aktiv farve og ensartet hover/fokus. Ingen ændring af linkenes geometri. |
| UX05 · mellem | Ny her og kalender | Digitalt medlemskort viser et prototypekoncept uden en brugbar medlemsfunktion. CTA'en leder ikke til et reelt resultat. | Synligt koncept og CTA i browser; ingen konto/backend i kode. | Sektion, dialog og kalender-CTA fjernet. Koncept og tidligere evidens er bevaret i historikken. |
| UX06 · mellem | Events | Links til fire Figma-demoer er tilgængelige fra den offentlige oversigt og konkurrerer med officielle arrangementer. | Synlig details-kontrol i før-screenshot og browser/kode. | Demo-promoveringen fjernet. Fire datasæt og direkte, tydeligt markerede demoruter bevares til undervisning/historik. |
| UX07 · mellem | Om / founders og værdier | Store »PORTRÆT AFVENTER BRUGSTILLADELSE«-flader og redaktionelle godkendelsesnoter bryder den offentlige oplevelse. | Synligt i både desktop-/mobilbrowser og Figma. | Faktuelle founderbiografier vises i salviefarvede tekstkort. Interne noter flyttet til denne rapport; ingen erstatningsportrætter er opfundet. |
| UX08 · mellem, fund under implementering | Om / nye founder-kort | Bordeaux brødtekst på salvie gav utilstrækkelig kontrast på desktop. | Den første efter-regression fandt en serious axe color-contrast-fejl. | Brødtekst og rolle bruger nu eksisterende `--tekst`, overskrifter bevarer bordeaux. Hele browserpakken blev gentaget og bestod. |
| UX09 · lav / bevaret | Om / responsive tekster | DOM indeholder både mobil- og desktoptekst; dette kunne ligne dubletter i et tekstudtræk. | Browser viser kun den relevante variant ved hver bredde. | Ingen reelle samtidige dubletter fundet. Responsive alternativer og founderfakta er bevaret. |
| UX10 · mellem / kendt afgrænsning | Kontakt | Formularen er fortsat en demo, ikke en fungerende indbakke. | Browser: »PROTOTYPE · Intet sendes« før formularen og »Intet er sendt« i bekræftelsen; ingen POST eller lagring. | Ærlig afgrænsning bevaret; validering, fejl, fokus og reset testet. Ingen uautoriseret afsendelsesintegration tilføjet. |

## Carousel – faktisk årsag og løsning

Autoplay **var implementeret** med timeout, 4,5 sekunders interval og korrekt JavaScript-indlæsning i Astro. Der blev ikke fundet en hydration-fejl eller JavaScript-undtagelse. Fejlen var pauseområdets størrelse: `pointerenter`/`pointerleave` var bundet til hele `.gallery-section` (960 px høj på desktop). Introen er en del af den sektion. Den oprindelige IntersectionObserver fulgte også sektionen frem for billedvinduet.

Med markøren i skærmens midte og en scroll på 700 px stod den over `.gallery-intro`. Billedvinduet var synligt længere nede, men `hovered=true` blokerede timeren. Selv en efterfølgende placering af markøren øverst kunne efter scrolling ramme sektionens intro. Den gamle browsertest flyttede markøren kunstigt uden for viewporten og dækkede derfor ikke denne normale scrolltilstand.

Løsningen genbruger den eksisterende komponent og CSS-transforms:

- Hover gælder billedvinduet; fokus i carousellen, aktiv pointer, eksplicit pause, skjult fane og reduced-motion pauser stadig.
- IntersectionObserver følger `.gallery-window`; mindst 25 % skal være synligt. Introen alene starter ikke billedbevægelse.
- Én timeout ryddes, før næste oprettes. Manuel navigation giver mindst otte sekunders ventetid, og hover/fokus skal være ophørt før genoptagelse.
- 800 ms `transform`/`opacity` og cubic-bezier(.22,1,.36,1) bevares. Et yderkort flyttes skjult ved modulo-wrap; der tilføjes ingen JavaScript-animationskø.
- Map over instanser forhindrer dublerede listeners/timere. AbortController, observer-disconnect og annullerede animation frames rydder op ved fjernelse af selve komponenten eller en wrapper, Astro-swap og `pagehide`. `pageshow`/Astro page-load kan initialisere igen.
- Native knapper har handlingsnavne, der inkluderer den synlige tekst: Pause / Afspil / Automatik fra. Tilstanden fremgår af knapnavn og skjult live-status. Reduced-motion deaktiverer automatikknappen, mens pile og swipe virker. Automatisk skift annonceres ikke løbende til skærmlæseren.
- Space på selve billedregionen styrer pause; Space/Enter på knapper bevarer native adfærd. Et swipe kan ikke udløse et efterfølgende klik. Fotos har fortsat ingen tilfældige eventlinks.

**Tilsigtet pause:** Det er korrekt, at billederne står stille, når markøren er over selve galleriet, fokus er inde i det, eller systemets reduced-motion er aktiv. Play ophæver brugerens permanente pausevalg; øvrige pauseårsager skal også være ophørt. Dette er kontrolleret særskilt fra testen uden brugerinput.

### Bevis for ægte autoplay

Den endelige måling findes i [carousel.json](qa/ux-ui-final/after/carousel.json). Den bruger ingen kontrolleret tid til disse to skift: siden åbnes, der scrolles til synligt galleri, og der klikkes/tastes/swipes ikke på carousellen. Markøren bliver over introen, som tidligere udløste fejlen. Rækken nedenfor registreres fra den sidste, beståede måling.

| Bredde | Indeks ved start | Automatisk 1. skift | Automatisk 2. skift | Autoplay CLS |
| --- | --- | --- | --- | --- |
| 390 px | 0 · 0 ms | 1 · 4500 ms | 2 · 9001 ms | 0 |
| 768 px | 0 · 0 ms | 1 · 4501 ms | 2 · 8999 ms | 0 |
| 1440 px | 0 · 0 ms | 1 · 4503 ms | 2 · 9002 ms | 0 |

Supplerende tests med Playwright clock beviser to intervaller, automatisk 5 → 0, fuldt manuelt loop i begge retninger, hover-/fokus-/pointerpause, otte sekunders genoptagelse, vedvarende pause/play, offscreen, reduced-motion og oprydning/geninitialisering. Faneskjul er testet som en eksplicit `visibilitychange`-kontrakt, fordi headless Chrome ikke pålideligt skjuler baggrundstabs; dette er ikke en fysisk baggrundsfane-test. Mobil swipe bruger Chrome DevTools' native touch-events, ikke kun syntetiske DOM-pointerevents. Der blev ikke observeret autoplay-layoutskift.

## FAQ, navigation og microinteractions

FAQ bruger de tre uændrede spørgsmål/svar. `button[aria-expanded]` peger via `aria-controls` på et navngivet panel; Enter og Space virker uden egne keyboard-genveje. Svar er skjult som udgangspunkt, højst ét er åbent, og plus bliver til minus. Afbrudte animationer annulleres før et nyt skift. Reduced-motion giver 0 ms panelanimation og ingen ikontransition. Uden JavaScript vises alle spørgsmål/svar statisk uden en falsk, aktiv accordion-knap.

Navigationens eksisterende desktop- og mobilrækkefølge bevares. Mobil har fire allerede synlige links i Figma og i koden; der er **ingen skjult hamburger-/overlaymenu**, som skal åbnes eller lukkes. Ingen ny menu eller fokustrap er opfundet. Kun én navigation er synlig og fokusérbar ad gangen; logoet giver adgang til forsiden. Den eksisterende Ny her-mobilbrandvariant er bevaret efter sin Figma-frame.

Understregning animeres i 240 ms uden ændring af fontvægt eller bredde. Aktiv side markeres også uden hover, inklusive Ny her-knappen. Footer-/tekstlinks får diskret understregning, CTA'er en indvendig markering, og filtre/accordion en svag baggrund. Interaktive eventlinks fremhæves ved hover/fokus; almindelige overskrifter og brødtekst får ingen linkeffekt. Native felters eksisterende fokus og validering er bevaret. Reduced-motion fjerner de nye CSS-transitions.

## Indhold og visuel konsistens

Ingen autentiske fotos, fontfiler eller designsystemfarver er udskiftet. Typografi følger fortsat den tidligere afprøvede optiske størrelse (`font-optical-sizing: auto`), nul tracking og `font-synthesis: none`. Forside/legacy bruger Bricolage Grotesque; V2-overskrifter bruger DM Sans efter referenceframes. [Browseraflæste fonte, geometri, billedslots og CTA'er](qa/ux-ui-final/after/visual-inspection.json).

Fjernede elementer: medlemskortsektion/dialog og relateret kalenderlink, demo-catalog-kontrol på Events, tekniske portrætpladsholdere og mobile redaktionelle værdinoter. Historiske rapporter, data, direkte demoruter, originale billeder og øvrigt urelateret arbejde er bevaret. De faktuelle foundertekster, forskellige responsive versioner og værdiernes eksisterende ordlyd er ikke omskrevet til nye påstande. Redaktionelle værdier og foto-/portrættilladelser kræver fortsat ejerens gennemgang før en reel lancering.

Tokyos sted og tidszone er tydelige; det verificerede event er bevaret frem for at opfinde et lokalt København-event. Alle otte direkte Luma-links er åbnet read-only i Chrome med HTTP 200 og de forventede titler. Lumas strukturerede start-/sluttider er gemt i [ekstern kontrol](qa/ux-ui-final/luma-external-check.json), herunder Tokyo 13. november 18.30–20.00 GMT+9. Den tidligere dokumenterede årstalsafvigelse ved Real-talk og sluttidsafvigelsen ved Berlin er fortsat synlige. Ingen deltagernavne eller tilmeldinger er gemt. Profilen oplyser ti hosted events; det lokale otte-event-katalog påstår ikke at være en komplet, automatisk synkronisering.

### Før-/efter-evidens

Alle screenshots er fra rigtig browser, inklusive indhold under folden. Førversionen er live-ækvivalent; efterversionen er lokal production build. Spacing uden for ændrede komponenter er bevaret. Mobilforsiden er 50 px højere for at give plads til de nye kontroller uden overlap; desktop/tablet beholder højden. Ny her/Om/Events er kortere efter indholdsoprydningen.

| Side | 390 px før → efter | 768 px før → efter | 1440 px før → efter |
| --- | --- | --- | --- |
| Forside | [Før](qa/ux-ui-final/before/forside-390.png) · [Efter](qa/ux-ui-final/after/forside-390.png) | [Før](qa/ux-ui-final/before/forside-768.png) · [Efter](qa/ux-ui-final/after/forside-768.png) | [Før](qa/ux-ui-final/before/forside-1440.png) · [Efter](qa/ux-ui-final/after/forside-1440.png) |
| Ny her | [Før](qa/ux-ui-final/before/_ny-her_-390.png) · [Efter](qa/ux-ui-final/after/_ny-her_-390.png) | [Før](qa/ux-ui-final/before/_ny-her_-768.png) · [Efter](qa/ux-ui-final/after/_ny-her_-768.png) | [Før](qa/ux-ui-final/before/_ny-her_-1440.png) · [Efter](qa/ux-ui-final/after/_ny-her_-1440.png) |
| Om | [Før](qa/ux-ui-final/before/_om-kinddesign_-390.png) · [Efter](qa/ux-ui-final/after/_om-kinddesign_-390.png) | [Før](qa/ux-ui-final/before/_om-kinddesign_-768.png) · [Efter](qa/ux-ui-final/after/_om-kinddesign_-768.png) | [Før](qa/ux-ui-final/before/_om-kinddesign_-1440.png) · [Efter](qa/ux-ui-final/after/_om-kinddesign_-1440.png) |
| Events | [Før](qa/ux-ui-final/before/_events_-390.png) · [Efter](qa/ux-ui-final/after/_events_-390.png) | [Før](qa/ux-ui-final/before/_events_-768.png) · [Efter](qa/ux-ui-final/after/_events_-768.png) | [Før](qa/ux-ui-final/before/_events_-1440.png) · [Efter](qa/ux-ui-final/after/_events_-1440.png) |
| Kontakt | [Før](qa/ux-ui-final/before/_kontakt_-390.png) · [Efter](qa/ux-ui-final/after/_kontakt_-390.png) | [Før](qa/ux-ui-final/before/_kontakt_-768.png) · [Efter](qa/ux-ui-final/after/_kontakt_-768.png) | [Før](qa/ux-ui-final/before/_kontakt_-1440.png) · [Efter](qa/ux-ui-final/after/_kontakt_-1440.png) |

[FAQ åben 390](qa/ux-ui-final/after/faq-open-390.png) · [FAQ åben 1440](qa/ux-ui-final/after/faq-open-1440.png) · [Carousel 390](qa/ux-ui-final/after/carousel-390.png) · [Carousel 1440](qa/ux-ui-final/after/carousel-1440.png). Kalender og samtlige officielle/demo-detaljesider har egne screenshots i efter-mappen.

### Afvigelseslog mod Figma

| Reference | Browserobservation / beslutning |
| --- | --- |
| Forside, fælles farver, fotos og typografi | Genbrugt fra eksisterende komponenter. Ingen font-/billedsubstitution. Aktuel carousel følger den tidligere godkendte 3D/video-retning, som afviger fra Figmas gamle statiske perspektivbilleder. |
| FAQ og medlemskort på Ny her | Accordion og fjernelse af medlemskort følger den nye udtrykkelige instruks. Mobil FAQ har nu sand/bordeaux, hvor den gamle mobilframe havde lyseblå/sort. Dette er en tilsigtet ændring. |
| Om – founderportrætter og interne noter | Tekstkort erstatter kun tekniske pladsholdere. Ingen godkendte portrætter er fjernet eller opfundet. Brødtekst er mørk for kontrast. |
| Events og eventdetaljer | Det tidligere godkendte officielle Luma-katalog er bevaret; gamle Figma-demoer promoveres ikke. Derfor er indhold/sidehøjde ikke identisk med eksempel-eventframes. |
| Navigation | Fælles CTA er 165 px på stor desktop som V2-frames; den ældre Ny her-frame bruger 115 px. Den eksisterende fælles komponent er bevaret for konsekvent betjening. Hover/aktiv markering er en funktionel tilføjelse. |
| 768 px og mellembredder | Ingen godkendt 768 px-frame findes. Responsivt grid, spacing, stacking og tastaturkontrol er verificeret; ikke kaldt et Figma 1:1-match. |
| Raster og V2-hero | Små baseline-/antialiasingforskelle består. Den tidligere dokumenterede Figma-hero-geometri kan udløse Lighthouse billedproportionsadvarsel. Den er ikke ændret for at hæve en score. |

## Funktionel og tilgængeligheds-QA

| Kontrol | Resultat / evidens |
| --- | --- |
| Sideidentitet, meningsfuldt indhold og framework-overlay | Alle ruter har forventet HTTP-status, én h1 og indhold; ingen Astro/Vite-fejlskærm. |
| Responsiv production build | 153 side/bredde-kombinationer: 27 ruter ved 390/768/1440 og 12 repræsentative ruter ved 320/480/600/601/900/1024. [pages.json](qa/ux-ui-final/after/pages.json). |
| Console / netværk / billeder / overflow | Ingen JavaScript-undtagelser, fejlede lokale ressourcer, manglende billeder, klippede carouselkontroller eller vandret dokument-overflow. |
| Axe | 46 sidescanninger ved 390/1440: nul A/AA-fund. Dertil åbne FAQ'er, pause/reduced-motion, kontaktfejl/-bekræftelse og gamle demobekræftelser: nul automatiske fund. |
| Interaktioner | [UX/FAQ/navigation](qa/ux-ui-final/after/ux-interactions.json), [kontakt/demoer](qa/ux-ui-final/after/flows.json), [officielle eventflows](qa/ux-ui-final/after/official-flows.json), [smoke og no-JS](qa/ux-ui-final/after/smoke.json), [autoplay/touch](qa/ux-ui-final/after/carousel.json). |
| Filtre og kalender | Alle/Meetup/Workshop/Talk, kommende/tidligere, tomtilstand, reset, URL-parametre, reload/back, månedsskift og korrekt UTC-/UTF-8-ICS består. |
| Navigation og tastatur | Skip-link flytter fokus, Enter navigerer, Space aktiverer filtre/FAQ og carousel-pause, aktiv side og fokus ses, hover ændrer ingen linkrektangler. |
| Kontakt / data | Tomme/ugyldige/gyldige felter, fejloversigt, fokus, reset og ærlig lokal demo består. Ingen afsendelse eller localStorage-skrivning. |
| No-JS og høj pixeltæthed | Statisk galleri kan scrolles med tastatur, FAQ-svar er tilgængelige, kontakt kan ikke sende GET-data; retinahero og carousel vælger højopløste varianter. |
| Byg og deploy-konfiguration | Astro-build og `npm test`: 27 HTML-sider + ICS. Netlify CLI offline deploy-preview-build består; ingen hostet preview oprettet. [Logs](qa/ux-ui-final/after/logs/). |

Nøgler til gentagelse: `npm run build`, `npm test`, `npm run preview -- --host 127.0.0.1 --port 4321`, `npm run test:browser`, `npm run test:lighthouse`, `netlify build --offline --context deploy-preview`. `KINDDESIGN_QA_TOOLS` og `KINDDESIGN_QA_OUTPUT` kan pege på et andet isoleret værktøjssæt og outputsted. Scripts ligger i `scripts/qa`. Den fulde browserpakke blev gentaget efter kontrastrettelsen; efter de sidste navn-/kontrolrettelser blev relevante forside-, carousel-, axe-, build- og Lighthouse-kontroller gentaget særskilt.

### Lighthouse

16 lokale, sekventielle enkeltmålinger på otte ruter i mobilprofil 390 px og desktopprofil 1440 px. [Alle rapporter og endelig oversigt](qa/ux-ui-final/after/lighthouse/summary.json). Laboratoriemålinger er ikke feltdata eller en garanti på alle enheder.

| Side | Performance mobil / desktop | Mobil-LCP | Accessibility | CLS |
| --- | --- | --- | --- | --- |
| Forside | 89 / 100 | 3.83 s | 100 / 100 | 0 / 0 |
| Events | 96 / 98 | 2.78 s | 100 / 100 | 0 / 0 |
| Kalender | 100 / 100 | 0.90 s | 100 / 100 | 0 / 0 |
| Om | 100 / 99 | 1.88 s | 100 / 100 | 0 / 0 |
| Ny her | 92 / 100 | 3.38 s | 100 / 100 | 0 / 0 |
| Kontakt | 99 / 99 | 2.10 s | 100 / 100 | 0 / 0 |
| Tokyo-event | 100 / 100 | 0.90 s | 100 / 100 | 0 / 0 |
| Tidligere event | 100 / 100 | 0.90 s | 100 / 100 | 0 / 0 |

Alle målinger har accessibility 100 og CLS 0. SEO er 63 på grund af prototypens bevidste `noindex, nofollow`; canonical-domæne, sitemap og indeksering er fortsat et ejer-/lanceringsvalg. Best Practices er 96 på V2-desktop Events/Om/Kontakt på grund af den kendte billedproportion og ellers 100. Mobil-LCP på forside/Ny her er fortsat et forbedringspunkt; autentiske fotos og billedkvalitet er bevaret.

## Afsluttende professionel vurdering

| Spørgsmål | Vurdering |
| --- | --- |
| Professionelt og sammenhængende? | Ja som præsentationsprototype: fælles identitet, tydelige interaktioner og færre interne/døde konceptspor. |
| Intuitiv navigation? | Alle centrale destinationer kan nås med links og tastatur; mobil beholder sin enkle, synlige navigation. |
| Tydeligt tilbud? | Hero, introduktion og Ny her forklarer kreativt fællesskab og deltagelse gennem events. |
| Let at finde events? | Officielle events, type-/datofiltre, kalender og tydelig lokal tidszone hjælper; kataloget kræver redaktionel vedligeholdelse. |
| Logisk tilmelding? | Forside/Events → egen detaljeside → Luma. Arkiverede events foregiver ingen åben tilmelding. |
| Konsekvent hover/fokus? | Ja, kontrolleret visuelt og via geometri, fokus og tastaturtests. |
| FAQ korrekt? | Ja, tre uændrede svar, ét åbent ad gangen, ARIA og reduced-motion verificeret. |
| Autoplay uden input? | Ja, to ægte automatiske skift på alle tre bredder; loop og pauser er særskilt verificeret. |
| Carousel på mobil? | Autoplay og native Chrome-touch/swipe består. Fysisk enhed er ikke testet. |
| Overflødigt indhold? | Demo-promovering, medlemskoncept og udviklernoter er fjernet. Faktuelt og responsivt indhold er bevaret. |
| Typografi og spacing? | Eksisterende Figma-typografi og hovedkompositioner er bevaret; nye komponenter genbruger tokens. |
| Gennemarbejdet mobil? | 320–1440 px er kontrolleret uden overflow; centrale CTA'er og nye knapper har passende plads og touchstørrelse. |
| Tro mod Figma? | Ja i identitet og bevarede layouts, med de udtrykkeligt dokumenterede funktions-/indholdsændringer; intet generelt redesign. |
| Stadig ufærdige demoer? | Kontakt er fortsat tydeligt en demo. Gamle direkte demoruter er historik, ikke promoverede tilbud. Ingen medlemskonto. |
| Klar til KindDesign-præsentation? | Ja med tydelig forklaring af kontakt og manuelt eventkatalog. Ikke erklæret en fuldt lanceret kontakt-/medlemsservice. |

## Resterende begrænsninger og eksterne forhold

- Live-siden viser stadig den tidligere version. Denne lokale opgave publicerer ikke ændringerne. Automatisk GitHub→Netlify-forbindelse mangler fortsat, som beskrevet i publiceringsrapporten.
- Kontakt er en ærlig demo; en rigtig indbakke kræver modtager, afsendelsesløsning og relevante vilkår. Medlemskortet er fjernet frem for at opfinde en tjeneste.
- Eventkatalog og status ved build kræver vedligeholdelse/genbygning. Klienten lukker udløbne tilmeldings-CTA'er, men henter ikke nye events. De to eksisterende Luma-kildeafvigelser er bevaret synligt.
- Ingen manuel skærmlæser-, fysisk mobilenheds-, Safari-/Firefox- eller fuld zoomkombinationsaudit er gennemført. Automatiske nul-fund og Lighthouse 100 er ikke en fuld WCAG-certificering.
- Der er ingen væsentlig kendt, udokumenteret visuel fejl efter gennemgangen. Manglende tabletframe, legacy-mobilklipning, små rasterforskelle og V2-hero-geometri begrænser en streng 1:1-påstand.
- Det tidligere Supabase/SQL/CRUD-læringsmål er stadig ikke gennemført; der er ikke oprettet en unødvendig database i denne UX/UI-opgave.

## Lokale commits

| Commit | Indhold |
| --- | --- |
| `895b58e` | Baseline: den tidligere publicerede version med dokumentation. |
| `3c46dd6755adfd28c0cd92107c110a73d645bc03` | Lokal implementering af autoplay, FAQ, navigation og indholdsoprydning samt browser-/Lighthouse-evidens. |

Denne rapport, README og den ajourførte tekniske dokumentation gemmes i et efterfølgende dokumentationscommit; dets hash oplyses i leveringsbeskeden.

Alle ændringer i denne opgave er lokale. De tidligere rapporter beskriver deres respektive historiske versioner og er bevaret.
