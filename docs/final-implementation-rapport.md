# KindDesign – afsluttende carousel- og Luma-implementering

**Efterfølgende ændring:** Kontrolrækken er fjernet efter brugerens screenshot. Se seneste afsnit i [teknisk dokumentation](dokumentation.md); denne rapport bevarer den tidligere QA som historik.

9.–10. november 2026 · lokal branch `feature/fase-2-6` · udgangspunkt `a1c1323`.

Ingen push, merge, produktionsdeployment, databaseændring eller ekstern tilmelding er udført. Figma er læst, ikke redigeret. Fase 1–6-rapporterne og originale fotografier er bevaret som historik.

## Leveret

- Videreudviklet den eksisterende carousel til et responsivt 3D-galleri med glasrammer, centerfokus, perspektiv, bløde overgange og automatiske skift.
- Indarbejdet otte offentligt verificerede KindDesign-events: ét kommende og syv tidligere ved kildekontrollen.
- Forbundet den rigtige eventrejse: Forside → Events → egne eventdetaljer → direkte Luma-event. Ingen Luma-embed erstatter det redaktionelle design.
- Tilføjet kombinerede type-/statusfiltre, synlig tomtilstand, URL-historik og en kalender med valgbare måneder.
- Erstattet den opdigtede forside-nedtælling med tid til det verificerede kommende Tokyo-event.
- Tilføjet en rigtig ICS-download med korrekte UTC-tider til det kommende event. Download foretager ingen booking eller automatisk ekstern kalenderændring.
- Bevaret alle fire Figma-demoer som tydeligt adskilt prototypeindhold og kontrolleret kontakt, medlemskort, navigation og tastaturflows.
- Opdateret dokumentation, backendvurdering, tests og lokale build-/hostingchecks.

Builden omfatter 27 HTML-sider inklusive 404 samt en statisk ICS-fil. Astro er fortsat eneste direkte applikationsdependency; ingen animationspakke, React, TypeScript eller ekstra backend er indført.

## Carousel: video, design og adfærd

Den nu tilgængelige referencevideo er 720×1280, 30 fps og cirka 5,85 sekunder. Dens første del viser to kortskift; resten viser en trailer/modal, som ikke er overført. [Kontaktark](qa/final-implementation/reference/video-contact-sheet.jpg) og [bevægelsesudsnit med otte billeder pr. sekund](qa/final-implementation/reference/video-motion.jpg) dokumenterer analysen. Klippet fastlægger den visuelle bevægelse; det korte, redigerede klip er ikke et pålideligt mål for et længere autoplayinterval.

Overført fra videoen: et større, skarpt centerkort; overlappende sidekort med mindre skala, lavere opacitet og rotation; fine transparente rammer; diskrete skygger og en rolig acceleration/afbremsning. KindDesigns sand, salvie, bordeaux, fonte og egne fotos er bevaret. Filmplakater, farveskiftende baggrund, trailerafspiller og videoens øvrige branding er ikke indført.

Figma-eksporternes gamle desktopkort havde allerede perspektivet indbygget i billedet. For at undgå dobbelt forvrængning bruger den forbedrede komponent de eksisterende, uforvrængede originalfotos fra samme KindDesign-assetgrundlag. De gamle perspektivassets er bevaret. Communitybillederne kobles ikke til bestemte Luma-events, som de ikke dokumenterer. De egentlige eventkort bruger det korrekte officielle cover og linker til deres egen detaljeside.

| Egenskab | Implementering |
| --- | --- |
| Autoplay | 4.500 ms mellem skift, når mindst 25 % af galleriet er synligt |
| Overgang | 800 ms, `cubic-bezier(.22,1,.36,1)` |
| Animation | Kun `transform` og `opacity`; ingen animerede bredder/højder |
| Dybde | Perspective 1200 px på større skærme, 900 px på mobil; `translate3d`, `rotateY` og scale |
| Glas | Sandfarvet transparens, fin border, moderate skygger og 10 px backdrop-blur |
| Loop | Cirkulært indeks; usynligt yderkort repositioneres uden passage gennem centrum |
| Midlertidig pause | Hover, fokus, drag/touch, skjult dokument og galleri uden for viewport |
| Manuel navigation | Pile, seks indikatorer, venstre/højre piletast, Home/End og swipe |
| Genoptagelse | Tidligst efter otte sekunders inaktivitet og efter hover/fokus er ophørt |
| Pause/play | Synlig kontrol med vedvarende brugerbeslutning og `aria-pressed` |
| Reduced-motion | Ingen autoplay eller CSS-overgange; manuel navigation bevares |
| Fokus og annoncering | Fokus flyttes ikke ved billedskift; kun manuelle skift annonceres |
| Sidekort | Fotos som visuel kontekst; kun aktiv billedtekst vises, så nedtoning ikke skaber ulæselig tekst |
| Uden JavaScript | Native vandret galleri med billeder og deaktiverede interaktionsknapper |

En [lokal browseroptagelse](qa/final-implementation/carousel-motion.webm) viser de faktiske overgange; [retinascreenshot](qa/final-implementation/carousel-retina-390.png) dokumenterer billedkvalitet ved DPR 2.

Galleriet genbruger komponentens array, indeks, kontroller og viewport-observation. Det har nu én fælles track på alle bredder. Pointercapture samler et swipe, vertikal scrolling bevares, og et efterfølgende swipe-klik undertrykkes. Der er ikke indført navigation til tilfældige events.

## Verificeret Luma-katalog

Kilde: [KindDesigns officielle profil](https://luma.com/user/kinddesign). Profilen viste 10 hosted events, men dens offentligt viste eventliste gav otte tilgængelige direkte eventlinks ved kontrollen. De resterende to er ikke opfundet eller antaget at være offentlige. Dette er et manuelt verificeret udsnit, ikke en fuldstændig kontoeksport.

Alle tider nedenfor er lokale i eventets egen IANA-tidszone. Dansk tidszone er ikke fejlagtigt anvendt på Tokyo. Titel, UTC-start/-slut, sted, officielle coverkilder, verificeringsdato og direkte URL er samlet i [kildemanifestet](qa/final-implementation/luma-source-manifest.json) og `src/data/luma-events.js`. Dansk brødtekst er en kort opsummering; originalbeskrivelserne findes på Luma.

| Event / direkte kilde | Lokal dato og tid | Sted | Status ved kontrol |
| --- | --- | --- | --- |
| [From Ballet to Technology: On Reinvention and Creative Identity](https://luma.com/cmapoye1) | 13. november 2026, 18.30–20.00 · Asia/Tokyo | Vague, Tokyo, Japan | Kommende |
| [AI skillsharing for designers & creatives](https://luma.com/c3bj5f9d) | 29. oktober 2026, 18.00–20.00 · Europe/Copenhagen | DEPT®, København | Afsluttet |
| [Kinddesign / Real-talk](https://luma.com/c3jcu29h) | Kalenderdata: 1. juli 2026, 18.00–20.00 · Europe/Copenhagen | Bernies.Space, Frederiksberg | Afsluttet; årstalskonflikt |
| [Designers & Creatives Meet-Up / Barcelona](https://luma.com/n6nwx061) | 14. maj 2026, 18.00–20.00 · Europe/Madrid | Theodora Extra, Barcelona | Afsluttet |
| [Designers & Creatives Meet-Up / BERLIN](https://luma.com/84v57ubf) | 18. december 2025, fra 18.30 · Europe/Berlin | Jane & the Jam, Berlin | Afsluttet; sluttid uafklaret |
| [Designers & Creatives Meet-Up / CPH xmas edition](https://luma.com/iq2qpyk4) | 17. december 2025, 18.00–20.00 · Europe/Copenhagen | Rascal, Frederiksberg | Afsluttet |
| [Designers & creatives meet-up](https://luma.com/jdv50gdz) | 29. oktober 2025, 18.00–20.00 · Europe/Copenhagen | ÅBEN Nordhavn, København | Afsluttet |
| [Designers & creatives meet-up](https://luma.com/bszies4x) | 17. september 2025, 18.00–20.00 · Europe/Copenhagen | Dave’s, København | Afsluttet |

Tokyos offentlige side viste 18.30–20.00 GMT+9, en billetpris på 1.000 JPY og krav om værtsgodkendelse. Websitet henviser til Luma for endelige priser, vilkår og pladser. Der er ingen påstand om gratis adgang, garanterede pladser eller gennemført tilmelding.

### Konflikter og adskillelse fra demoer

Real-talk har UTC-/kalenderdato i 2026, mens beskrivelsen skriver 2025. Berlin slutter kl. 19.30 i kalenderdata, mens beskrivelsen siger 20.30. Begge konflikter står synligt på detaljesiderne. Berlin viser kun starttid, og ingen af de afholdte events tilbyder tilmelding eller kalenderdownload. Konflikterne er ikke løst ved gæt.

De fire Figma-events matcher hverken titler, datoer eller lokationer på de verificerede Luma-events. Derfor er de bevaret under »Figma-prototypens eksempel-events« med demo-ruter, og tidligere valgfrie `PUBLIC_LUMA_*`-overrides er fjernet. Et indsat eksternt link kan dermed ikke gøre en opdigtet eventdato til en rigtig booking.

### Integration og vedligeholdelse

Lumas [officielle API](https://docs.luma.com/reference/getting-started-with-your-api) kræver Luma Plus og en kalenderafgrænset API-nøgle. Ingen Luma-API-nøgle eller dokumenteret API-adgang er stillet til rådighed. Den anvendte fallback er derfor verificerede direkte links og et enkelt lokalt datamodul. Der er ingen tilbagevendende scraping, browserautomation i builden eller skjulte Luma-endpoints i applikationen.

Kildekontrollen var en engangsundersøgelse af offentlige sider og deres almindeligt leverede eventoplysninger. Der er ikke gemt deltagerlister, betalingskonti eller credentials i kataloget. Offentlige eventcovers er hentet fra de verificerede CDN-kilder; originalfiler er bevaret, og responsive WebP-varianter er målt. Der er ikke anvendt stock- eller AI-erstatningsbilleder.

Ved opdatering: kontrollér profil og direkte eventside, opdatér datamodulet og coverkilden, angiv verificeringsdato, kontrollér tidszone/konflikter, kør build og tests, og review ændringen. Status beregnes ved build og kontrolleres igen i klienten ved indlæsning og hvert minut. Det er ikke en live-synkronisering af nye events eller ændrede priser.

## Funktionalitet og QA

Testrejsen er appindlæsning → navigation/filtre → korrekt event → Luma-destination eller tydelig demo; carouselens automatiske og manuelle tilstande kontrolleres separat. Browser-plugin er ikke tilgængelig i sessionen (`Browser plugin not available`), så den installerede Playwright/Chrome-workflow er anvendt som foreskrevet af frontend-QA-skillen.

| Kontrol | Evidens og omfang |
| --- | --- |
| Sideidentitet og indhold | Titler, dansk sprog, én h1 og meningsfuldt indhold; ingen blank side eller frameworkoverlay |
| Responsive layouts | 27 ruter ved 390/768/1440 og 12 repræsentative ruter ved 600/601/1024: 117 kombinationer |
| Ressourcer og JavaScript | Sidefejl, fejlede HTTP-ressourcer, manglende billeder og dokument-overflow kontrolleres; tilsigtet 404 accepteres |
| Accessibility | Axe WCAG A/AA på referencebredder, kontaktfejl, bekræftelser og medlemsdialog; suppleret med tastaturtests |
| Carousel | 4,5 s autoplay, 8 s manuel pause, loop begge veje, hover/fokus, offscreen, pause/play, indikatorer, reduced-motion og systemændring |
| Skjult fane | `document.hidden`/`visibilitychange` er simuleret, da headless Chrome holdt tabs synlige; handleren og timerpausen er testet, fysisk OS-baggrundsadfærd er ikke certificeret |
| Touch | Native touch-sekvens via Chrome DevTools; slide skifter uden utilsigtet navigation |
| Officielle flows | Alle/kategori/status, tomtilstand, reset, reload/tilbage, korrekt eventside, direkte Luma-destination, kalenderens måned og ICS-UTC-tider |
| Bookingbeskyttelse | Luma-afgangen afprøves med en lokal intercept/testdestination; ingen ekstern booking udføres |
| Afsluttede events | Ingen tilmeldings- eller kalenderdownloadknap; dato-/sluttidskonflikter er synlige |
| Udløb | Klienten fjerner tilmeldingshandlingen efter sluttid; forsidens countdown/promo skifter til afsluttet |
| Bevarede demoer | Fire tilmeldings- og kalenderdemoer ved alle tre referencebredder |
| Kontakt og dialog | Tomme/ugyldige/gyldige felter, fokus, reset, Escape; ingen POST eller localStorage-skrivning |
| Uden JavaScript | Native billedgalleri og sikker, deaktiveret kontakt-submit; kalenderens aktuelle måned bevares |
| Build og hosting | Astro production build, statiske link-/ankerkontroller, datatests og Netlify CLI offline-build |

Miljø: [Node, Astro, Chrome og QA-værktøjer](qa/final-implementation/environment.json).

Resultater: [117 browserkontroller](qa/final-implementation/pages.json), [carousel](qa/final-implementation/carousel.json), [officielle flows](qa/final-implementation/official-flows.json), [demo-/kontaktflows](qa/final-implementation/flows.json), [ekstra smoke](qa/final-implementation/smoke.json), [data/ICS](qa/final-implementation/luma-config.json), [build](qa/final-implementation/build.log), [statiske tests](qa/final-implementation/static-tests.log) og [Netlify offline-build](qa/final-implementation/netlify-offline-build.log).

### Rettelser fundet under kontrollen

- En arvet `justify-content: flex-start` venstrestillede pilesymbolerne. De er eksplicit centreret i deres knapper og screenshotkontrolleret igen.
- For lav kontrast i nedtonede sidekorts billedtekster: kun aktiv billedtekst vises nu.
- Unødvendig konkurrerende billedtrafik før galleriet blev synligt: fotoindlæsning styres nu tæt på viewporten, med native billedfallback uden JavaScript.
- Unødvendig fontpreload på undersider: Bricolage preloads på forsiden og legacy-sider, der bruger fonten; V2-sider undgår den unødvendige preload. Ingen fontfamilie er erstattet.
- Ved 601 px blev pausekontrollen klippet 23 px af sektionens kant. Tablet-kontrollerne forankres nu til sektionens bund, og tests kontrollerer også knappernes faktiske grænser. [Førmåling](qa/final-implementation/before/control-bounds.json).
- En Lighthouse-måling på kalenderen viste et fontrelateret CLS på 0,036. Bricolage-preload er derfor bevaret på de legacy-sider, der faktisk bruger fonten; besparelsen begrænses til V2-sider.
- Kalenderfilens generering fjerner millisekunder fra DTSTAMP som krævet af RFC 5545; en særskilt formattest beskytter kalenderimporten.
- Eventcovers har varianter på 450/600/højst 1200 px, kvalitet 92. Srcset-deskriptorer og intrinsiske dimensioner følger faktisk filstørrelse, også når originalen er 1080 px og ikke skal opskaleres.

### Lighthouse og performance

20 afsluttende målinger med Lighthouse 13.6.0: ti repræsentative ruter i mobilprofil 390 px og desktopprofil 1440 px. Målingerne er kørt sekventielt, og berørte sider er målt igen efter rettelser. [Samlet maskinlæsbar oversigt](qa/final-implementation/lighthouse/summary.json).

| Side | Performance mobil | Performance desktop | LCP mobil |
| --- | ---: | ---: | ---: |
| Forside | 89 | 100 | 3.76 s |
| Events | 96 | 98 | 2.78 s |
| Kalender | 100 | 100 | 0.90 s |
| Om KindDesign | 100 | 99 | 1.88 s |
| Ny her | 92 | 100 | 3.38 s |
| Kontakt | 99 | 99 | 2.10 s |
| Kommende Tokyo-event | 100 | 100 | 0.90 s |
| Tidligere AI-event | 100 | 100 | 0.90 s |
| Figma-demo: eventdetalje | 90 | 98 | 3.60 s |
| Tilmeldingsdemo | 100 | 100 | 0.90 s |

Alle 20 afsluttende audits har **accessibility 100 og CLS 0**. Best Practices er 100, bortset fra Events/Om/Kontakt desktop med 96 på grund af den tidligere dokumenterede Figma-hero-proportion. SEO er fortsat 63 på alle sider, fordi prototypen bevidst har noindex/nofollow. Der hævdes ikke lanceringsklar SEO eller fuld WCAG-certificering.

Den første runde med det udvidede katalog viste mobilforside 82 og Events 83. Efter billed-/fontoptimering er de 89 og 96. Den fontrelaterede kalender-CLS på cirka 0,036 er fjernet efter korrekt preload; den afsluttende måling er 0. Førmålinger er bevaret i [før-mappen](qa/final-implementation/before/lighthouse).

Det er lokale laboratoriemålinger, ikke feltdata eller medianer fra mange gentagelser. Mobilforsidens LCP er stadig cirka 3,76 sekunder; Ny her og den gamle eventdemo ligger omkring 3,4–3,6 sekunder. Billedbudget og LCP skal følges op på det faktiske preview og fysiske enheder før produktion. Kvalitet 92 og autentiske originaler er bevaret.


## Visuel QA og screenshots

Figma-home `753:847` og Events V2 `776:1747` er læst igen med designkontekst og screenshot. De eksisterende referenceeksporter ved 390/1440 px er genbrugt til direkte overlays. 768 px har fortsat ingen godkendt Figma-frame og er kontrolleret responsivt.

Om KindDesign, Kontakt og Ny her er sammenholdt med de tidligere verificerede screenshots ved 390/768/1440: ni fuldsidesammenligninger med gennemsnitlig pixelkanalforskel **0**. Det dokumenterer fravær af visuelle regressioner på disse sider i de testede tilstande. Direkte Figma-overlays for uændrede sider og første demo-event er i [overlays](qa/final-implementation/overlays); [målinger](qa/final-implementation/visual-comparison.json) og [regression mod fase 6](qa/final-implementation/unchanged-page-regression.json) er bevaret.

| Bredde | Carousel før | Carousel efter | Forside efter |
| --- | --- | --- | --- |
| 390 | [Før](qa/final-implementation/before/carousel-390.png) | [Efter](qa/final-implementation/carousel-390.png) | [Hele siden](qa/final-implementation/forside-390.png) |
| 768 | [Før](qa/final-implementation/before/carousel-768.png) | [Efter](qa/final-implementation/carousel-768.png) | [Hele siden](qa/final-implementation/forside-768.png) |
| 1440 | [Før](qa/final-implementation/before/carousel-1440.png) | [Efter](qa/final-implementation/carousel-1440.png) | [Hele siden](qa/final-implementation/forside-1440.png) |

- Events: [390](qa/final-implementation/_events_-390.png) · [768](qa/final-implementation/_events_-768.png) · [1440](qa/final-implementation/_events_-1440.png).
- Kommende Tokyo-event: [390](qa/final-implementation/_events_from-ballet-to-technology_-390.png) · [768](qa/final-implementation/_events_from-ballet-to-technology_-768.png) · [1440](qa/final-implementation/_events_from-ballet-to-technology_-1440.png).
- Kalender: [390](qa/final-implementation/_events_kalender_-390.png) · [768](qa/final-implementation/_events_kalender_-768.png) · [1440](qa/final-implementation/_events_kalender_-1440.png).

### Bevidste forskelle og resterende grænser

Carousellens nye dybde, overlap, rammer, indikatorer og kontroller er ændringer efter den nye video/opgave, så dens gamle statiske Figma-komposition er ikke et pixelidentisk mål. Desktopforsidens sektioner bevarer højderne; mobilgalleriet er vokset fra Figma-referencens 692 til 918 px for at rumme et tydeligt centerkort og kontroller. Hele mobilforsiden er nu 3018 px. Dette er dokumenteret ny funktionalitet, ikke en skjult rasterafvigelse.

Events og de officielle detaljesider indeholder reelle titler, datoer, steder og covers i stedet for Figma-demoerne. Tekstkolonner må derfor vokse, og de officielle posters bevares hele med contain. Figma-identitet, hierarki, tokens og genbrugte komponenter er bevaret; der hævdes ikke ens sidehøjder for forskelligt indhold.

Små Figma/Chrome-rasterforskelle består på uændrede sider. Legacy-mobilframes for Ny her og de gamle eventdetaljer klipper fortsat ved 844 px; deres manglende direkte fuldsideoverlays er ikke blevet løst ved at ændre Figma. Safari/Firefox, fysisk mobil, fuld skærmlæser-/zoomgennemgang og OS-specifik baggrundsadfærd er ikke testet. En valgfri Browser-plugin-installation kan supplere fremtidig QA med browsernavigation og logs direkte i appen.

## Supabase og øvrige eksterne afhængigheder

CRUD er obligatorisk i den oprindelige opgavebeskrivelse, men er stadig **ikke gennemført**. Den relevante minimale funktion er redaktøradministration af det verificerede eventkatalog. Den read-only Supabase-projektliste identificerede intet sikkert KindDesign-testprojekt; et generisk inaktivt projekt er ikke gendannet eller brugt. Der mangler en identificeret testdatabase og redaktørautorisation. Ingen database er forespurgt, ingen nøgle hentet, og ingen Auth eller offentlig skriveadgang er tilføjet. Se [den fornyede vurdering](fase-4-supabase-vurdering.md) og [adgangskontrollen](qa/final-implementation/supabase-access-review.json).

Før produktion: afklar de to Luma-kildekonflikter, gennemgå nye/ændrede events, verificér billedrettigheder, få et hostet Deploy Preview og kontrollér headers/dybe links/ICS dér. Vælg domæne og canonical, og revurdér noindex. Kontakt og medlemskort er stadig demoer; de må ikke fremstilles som driftstjenester. Ingen produktion eller GitHub-push er autoriseret i denne leverance.

## Lokale commits og kodeforståelse

| Commit | Indhold |
| --- | --- |
| `04aef1b` | Tidligere fase 1-reference for fonte og visuel kvalitet |
| `a1c1323` | Udgangspunkt: den afsluttede lokale fase 2–6-leverance |
| `6dd09c8` | Ny glass-carousel, verificeret Luma-katalog, kalender, rettelser, tests og samlet QA |
| `ff48f1e` | Registrering af implementeringscommit i rapporten |
| `e3c91ab` | Centrerede navigationspile og opdateret afsluttende screenshot-/video-QA |

Hashregistreringen gemmes i et separat lokalt dokumentationscommit. Alle ændringer ligger på `feature/fase-2-6`; ingen remotehandling er udført.

Gruppen skal kunne forklare arrays, modulo, DOM-events, timeout/pause, `matchMedia`, IntersectionObserver, native pointer/touch, ARIA og browserhistorik. Luma-data er lokale kildeposter med tidszoner; de er ikke en database eller et live-API. Kalenderfilen er en statisk fil, ikke en reservation. Det adskiller den leverede frontend fra de stadig udestående CRUD- og hostinglæringsmål.
