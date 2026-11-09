# KindDesign – samlet rapport for fase 2–6

Dato: 9. november 2026. Lokal branch: `feature/fase-2-6`, baseret på fase 1-reference `04aef1b`. Ingen push, merge, ekstern publicering eller produktionsændringer er foretaget. Figma er aflæst som kilde; originaldesignet er ikke ændret.

## Leverance og afgrænsning

| Fase | Resultat | Status |
| --- | --- | --- |
| 2 | Automatisk carousel med manuel navigation, loop, mobilscroll, pause og reduced-motion | Implementeret og lokalt testet; referencevideo mangler |
| 3 | Alle dokumenterede undersider, filtre, kalender og Figma-demoflows | Implementeret og lokalt testet |
| 4 | Vurdering af behovet for Supabase | Fravalgt efter seneste instruktion; SQL/CRUD/RLS-læringsmålet er ikke gennemført |
| 5 | Netlify-konfiguration, miljøeksempel og reel CLI-offline-build | Verificeret lokalt; GitHub-forbindelse og hostet Deploy Preview mangler |
| 6 | Samlet funktionel, visuel, tilgængeligheds- og performancekontrol samt dokumentation | Resultater nedenfor |

Dette er en fungerende lokal prototype. Figma beskriver demo-events, kontakt uden afsendelse, medlemskort som koncept og founderportrætter, der afventer tilladelse. Disse faktagrænser er bevaret. Der er ikke opfundet bookbare events, medlemsfunktioner eller rigtige Luma-adresser.

## Implementerede sider og funktioner

19 statiske HTML-sider inklusive 404:

- Forside med den eksisterende Figma-komposition og nu fungerende carousel.
- Events V2 med alle/meetup/workshop/talk-filtre, URL-parametre, reload og tilbagehistorik.
- Novemberkalender med korrekt ugedagsplacering, seks uger og links til eksempel-events.
- Fire eventdetaljer: Design & nye forbindelser, Idéer på papir, Design i virkeligheden og Et bord, nye ansigter.
- Fire tilmeldingsdemoer med tydelig »IKKE tilmeldt«-bekræftelse og retur til event.
- Fire kalenderdemoer med »Intet er tilføjet«.
- Om KindDesign V2, Ny her og Kontakt V2.
- Kontaktvalidering med fejloversigt, feltfejl, fokus, lokal demobekræftelse og nulstilling. Ingen data sendes eller lagres.
- Medlemskort-koncept i native desktopdialog og en selvstændig 404-side.

Navigation, footer og CTA'er linker nu til byggede sider. Aktiv Events-navigation omfatter også tilmeldings- og kalenderdemoerne. Alle HTML-sider har dansk sprog, én h1, titel og beskrivelse. Metadata og OpenGraph-tekst er tilføjet; prototypen beholder bevidst noindex/nofollow.

De fire valgfrie `PUBLIC_LUMA_*_URL` i `.env.example` kan pege på godkendte HTTPS-eventadresser hos lu.ma/luma.com. Det er en konfigurationsmulighed, ikke en verificeret ekstern bookingintegration. Figma-reactions peger på interne demoframes; de virkelige eventlinks er ikke leveret.

## Konkrete rettelser og optimeringer

- Mobilkort, sektionsgaps, desktopkort og praktisk information er målt efter aktive Figma-frames. En overflowfejl ved 601 px er fjernet ved at stable smalle kolonner.
- Kontaktens blur-validering kunne flytte knappen under klik. Valideringen sker nu ved submit og ved efterfølgende indtastning. Uden JavaScript er submit deaktiveret, så persondata heller ikke kan havne i en GET-query.
- Kalenderfaner og trinkort har fået den nødvendige kontrast. Knapper, labels, fokus og demobekræftelser er kontrolleret med axe og tastatur.
- Fontfamilie, vægt, automatisk optisk størrelse, breddeakse, line-height og nul letter-spacing fra fase 1 er bevaret. De samme variable fonte er komprimeret til WOFF2: 648.660 → 294.396 bytes, cirka 54,6 % mindre. Originale TTF-filer og licenser er bevaret.
- Samme fotografier leveres i responsive WebP-størrelser med kvalitet 92. Større mobilhero og logo er tilføjet til høj pixeltæthed. Den første Lighthouse-runde viste desuden for store mobilfiler på eventdetalje og kalender; de bruger nu mindre varianter af samme foto uden ændring af beskæringen. Ingen autentiske fotos er erstattet.
- Underside-CSS hentes kun på undersider. En midlertidig regressionsafvigelse på Events mobil blev fanget af screenshotmålingen: CSS-rækkefølgen nulstillede en margin. Global CSS indlæses nu før underside-CSS, og højden matcher igen Figma inden for én pixel.
- Om-sidens mobilbrødtekst er rettet til Figma-farven #280E11; CTA'er er rettet til de aflæste 200/170 px. Logoets proportioner bevares med object-fit: contain.
- Forsidens skip-link fik `tabindex="-1"` på sit mål, så tastaturfokus faktisk flyttes ind i hovedindholdet. Undersiderne havde allerede denne fokusdestination.
- 404, billedvarianter, fontpreloads og statiske link-/ankerkontroller er tilføjet. Ingen ekstra applikationsdependency er installeret.

## Verifikation

- Astro-build: 19 HTML-sider. `npm test`: alle byggede sider, lokale links, ankre og assets består.
- Playwright: 72 side/bredde-kombinationer, 12 repræsentative ruter ved 390, 600, 601, 768, 1024 og 1440 px. Ingen JavaScript-fejl, fejlede ressourcer, manglende billeder eller vandret sideoverflow.
- Axe WCAG A/AA på repræsentative sider ved 390/1440 px: ingen automatiske fund. Desuden kontrolleres åbne demo-/kontaktbekræftelser, fejltilstand og medlemsdialog.
- Alle fire event→tilmeldingsdemo→bekræftelse→retur samt kalenderdemoer består ved 390/768/1440 px. Alle filterkategorier, reload og browserhistorik består.
- Kontakt består med tomme felter, ugyldig e-mail, gyldig demo, reset og fokusretur. Ingen POST eller localStorage-skrivning registreret. No-JavaScript-fallback sender ingen kontaktdata.
- Carousel: manuel navigation, fuldt loop og reduced-motion ved 390/768/1440 px; automatisk skift og pause er desuden kontrolleret i den samlede regression.
- Ekstra smoke: skip-link, Enter-navigation, Space-filter, medlemsdialog/Escape/fokusretur, 404, no-JavaScript-galleri og retinahero.
- Netlify CLI: offline-build med deploy-preview-kontekst. Ingen hostet side er oprettet eller testet.

Evidens: [build](qa/fase-6/build.log), [statiske checks](qa/fase-6/static-tests.log), [72 browserkontroller](qa/fase-6/pages.json), [flows](qa/fase-6/flows.json), [smoke](qa/fase-6/smoke.json), [fontkontrol](qa/fase-6/font-compression-check.json) og [billedvarianter](qa/fase-6/responsive-assets.json).

### Lighthouse

Lighthouse 13.6.0 er kørt sekventielt mod lokal preview på otte ruter i mobilprofil 390 px og desktopprofil 1440 px. De berørte sider er målt igen efter de sidste rettelser; [endelig oversigt](qa/fase-6/lighthouse/summary.json) indeholder 16 målinger. Det er enkeltstående laboratoriemålinger, ikke feltdata eller en statistisk garanti.

| Side | Performance mobil | Performance desktop | LCP mobil |
| --- | ---: | ---: | ---: |
| Forside | 86 | 100 | 4,28 s |
| Events | 91 | 97 | 3,45 s |
| Kalender | 89 | 99 | 3,83 s |
| Om KindDesign | 95 | 98 | 3,00 s |
| Ny her | 92 | 100 | 3,38 s |
| Kontakt | 93 | 98 | 3,23 s |
| Første eventdetalje | 90 | 98 | 3,60 s |
| Tilmeldingsdemo | 100 | 100 | 0,90 s |

Alle 16 målinger har accessibility 100 og CLS 0. Best Practices er 100, bortset fra Events/Om/Kontakt desktop med 96 på grund af den dokumenterede Figma-hero-proportion. SEO er 63 på alle sider på grund af den bevidste blokering af indeksering; det er ikke et mål for lanceringsklar SEO.

Forsidens mobilperformance er forbedret fra 77 til 86 efter font-/billedoptimering. Den første fase 6-runde viste eventdetalje 79 og kalender 82; responsive billedvarianter løftede dem til 90 og 89. Førmålinger er bevaret i [før-mappen](qa/fase-6/before). Mobil-LCP på indholdssiderne er stadig 3,0–4,3 sekunder i den simulerede profil og skal følges op før produktion. Kvalitet 92 og autentiske fotokilder er bevaret frem for at reducere billedkvaliteten alene for en score.

Den valgfrie Luma-konfiguration er desuden testet med to midlertidige builds: en syntetisk tilladt domæne-URL gav ekstern CTA, mens en URL uden for tilladte domæner bevarede den lokale demo. [Resultat](qa/fase-6/luma-config.json). Ingen URL-fixture er lagt i almindeligt eventindhold, og ingen ekstern side blev åbnet.

## Screenshotbaseret QA

Fuldsidescreenshots ved 390/768/1440 px ligger i `docs/qa/fase-6`; Figma-referencer er bevaret i `docs/qa/fase-3/references`. De otte direkte fuldsidesammenligninger omfatter Events, Om, Kontakt desktop/mobil samt Ny her og første eventdetalje desktop. De øvrige eventdetaljer er kontrolleret med egne tekster/fotos og det fælles layout. [Målinger](qa/fase-6/visual-comparison.json) og [overlays](qa/fase-6/overlays) sammenholder alle pixels, inklusive indhold under folden.

| Referencebredde | Side | Figmahøjde | Kodehøjde |
| --- | --- | ---: | ---: |
| 1440 | Events | 2091 | 2091 |
| 1440 | Om KindDesign | 2161 | 2161 |
| 1440 | Kontakt | 1961 | 1961 |
| 1440 | Ny her | 2473 | 2471 |
| 1440 | Første eventdetalje | 2531 | 2531 |
| 390 | Events | 3273 | 3274 |
| 390 | Om KindDesign | 3836 | 3835 |
| 390 | Kontakt | 2002 | 2000 |

Samme højde er alene et geometrisk mål, ikke et bevis på pixelidentitet. Antialiasing, enkelte baselines og komprimerede fotopixels giver målbare forskelle. De otte sammenligninger har gennemsnitlig kanalafvigelse 2,58–8,90 på skalaen 0–255; 2,55–7,78 % af pixels har en kanalafvigelse over 30. Disse mål er diagnostik, ikke en automatisk visuel godkendelse. En fonttest før/efter WOFF2 gav præcis samme pixels i de to testede tekstudsnit; der hævdes ikke identitet mellem Figma og Chrome.

Før/efter-eksempler:

| Kontrol | Før | Efter |
| --- | --- | --- |
| Events 390, billedoptimering | [Før](qa/fase-6/before/events-390.png) | [Efter](qa/fase-6/_events_-390.png) |
| Fontoverskrift, WOFF2 | [TTF](qa/fase-6/before/font-heading.png) | [WOFF2](qa/fase-6/font-heading.png) |
| Brødtekst, WOFF2 | [TTF](qa/fase-6/before/font-body.png) | [WOFF2](qa/fase-6/font-body.png) |
| Forside og carousel | [Fase 1-rapportens screenshots](fase-1-rapport.md) | [390](qa/fase-6/forside-390.png) · [768](qa/fase-6/forside-768.png) · [1440](qa/fase-6/forside-1440.png) |

### Resterende visuelle afvigelser og kildegrænser

- Der findes ingen 768 px-reference. Tablet og mellembredder er testet som responsive fortolkninger, ikke erklæret 1:1.
- Legacy-mobilframes for Ny her/eventdetaljer klipper deres indhold til 844 px. Hele indholdslaget er aflæst, og fulde kodesider er screenshotkontrolleret. Direkte fuldsideoverlays for disse to legacy-mobilframes mangler, fordi Figma-værktøjerne til eksportkopier blev utilgængelige under arbejdet. V2-mobilreferencerne er fuldt eksporteret og sammenlignet.
- Carouselens nævnte referencevideo er ikke blandt de tilgængelige projektfiler. Bevægelsen følger Figma-positioner og tekstkrav; videopræcis timing er ikke verificeret. Pausekontrol og mobilpile er nødvendige interaktionstilføjelser.
- V2-desktopheroens billedgeometri følger Figma, som ikke bruger originalfotoets naturlige proportioner. Lighthouse kan derfor markere dette som billedproportionsafvigelse. Det er dokumenteret frem for at ændre det godkendte udsnit for auditens skyld.
- Små raster-/baselineforskelle, 1–2 px højdeafrunding og native formkontrolrendering består. Ingen fuldstændig bitidentitet eller fælles Figma/Chrome-renderer hævdes.
- Grundlæggerportrætter, redaktionelle værdiforslag og medlemskortets konceptmarkeringer er beholdt fra Figma. Disse er indhold, der afventer godkendelse, ikke manglende billedeeksporter erstattet af tilfældige personer.

## Udeståender før produktion

1. Godkend eventdata, datoer, steder og rigtige Luma-links; test den eksterne booking uden at foretage uautoriserede tilmeldinger. Erstat eksempel-nedtælling med besluttet adfærd eller fjern den efter designbeslutning.
2. Afklar foto-/portrættilladelser og redaktionelle værdier. Ingen uafhængig rettighedsaftale er dokumenteret i materialet.
3. Beslut om kontakt og medlemskort skal være rigtige tjenester. Den nuværende version sender intet og har ingen medlemskonto. En senere backend skal have et konkret formål og separat adgangskontrol; SQL/CRUD/RLS-læringsmålet mangler fortsat.
4. Efter særskilt publiceringsgodkendelse: push/review, Netlify-repositoryforbindelse og hostet Deploy Preview; kontrollér dybe links, 404, headers og miljøværdier dér. Vælg derefter domæne, canonical, sitemap og indeksering.
5. Manuel Safari/Firefox-, skærmlæser-, zoom- og reel mobilenhedstest. Automatiske axe- og Chrome-tests beviser ikke fuld WCAG-overholdelse.
6. Kontrollér mobil-LCP og billedbudget på det faktiske preview og på et langsommere netværk; de lokale målinger viser stadig plads til forbedring.
7. Supplér de manglende legacy-mobile fuldsideoverlays og referencevideo, når kilderne er tilgængelige. Der er ingen kendt teknisk blokering for fortsat lokal visning.

## Kodeforståelse

Astro bygger ruter og genbruger komponenter; CSS Grid/Flex og media queries genskaber kompositionerne. Vanilla JavaScript reagerer på events og ændrer DOM, ARIA og browserhistorik. Carousel bruger arrays, et aktivt indeks, modulo og en timer. Kontakt bruger browserens validity, fejloverblik og fokus uden netværk. Gruppen skal kunne forklare disse dataflows, forskellen på statisk build og hosting samt hvorfor en vurderet databaseintegration ikke er det samme som implementeret CRUD/RLS. Detaljer og faser findes i [dokumentationen](dokumentation.md) og de separate fase 2–5-rapporter.


## Lokale commits

| Commit | Indhold |
| --- | --- |
| `04aef1b` | Fase 1-reference: afsluttende font- og visuel QA |
| `0d0d3b6` | Fase 2: carousel, pause, loop og manuel navigation |
| `b11e1e8` | Fase 3: Figma-sider, filtre og demoflows |
| `ef2cf6e` | Fase 4: Supabasevurdering og dokumenteret fravalg |
| `832e497` | Fase 5: Netlify-konfiguration og linkchecks |
| `62fd998` | Fase 5: bestået reel CLI-offline-build |
