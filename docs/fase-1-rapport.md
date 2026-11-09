# Fase 1 – afsluttende visuel QA

9. november 2026 · `feature/fase-1-forside` · Ingen push, merge eller deployment.

**QA er gennemført for hele forsiden. De væsentlige fontbredde- og tekstombrydningsafvigelser er rettet. Build, browser- og interaktionstests består ved 390, 768 og 1440 px.** Der er mindre dokumenterede rasterforskelle. Der findes ingen godkendt 768 px-frame, så et Figma 1:1-match ved tablet kan ikke godkendes. Fase 2–6 er ikke startet.

## Årsag og ændringer

Fontfamilierne og de lokale fontfiler var korrekte: Bricolage Grotesque til overskrifter, DM Sans til øvrig tekst. CSS-vægtene er fortsat 700 for overskrifter/desktopnavigation og 400 for øvrig tekst. Breddeaksen er normal (100), og letter-spacing er eksplicit 0. Fontfiler, fotografier og godkendte Figma-frames er ikke udskiftet eller redigeret.

Problemet var den fastlåste optiske akse. Figma-metadata rapporterer `opsz: 14`, men den værdi reproducerer ikke referenceeksportens faktiske bogstavbredder. Et kontrolleret browserforsøg med mobiloverskriften på 66 px sammenlignede samme familie og vægt med forskellige akser. I tekstudsnittet faldt den gennemsnitlige absolutte kanalforskel fra 43,24 med opsz 14 til 5,50 med opsz 66. En Arial-kontrol gav 48,09 og var dårligere. Se [fontforsøget](qa/final/font-experiment.json). Disse mål vedrører kun tekstudsnittet, ikke hele siden.

`font-optical-sizing: auto` følger nu fontstørrelsen. Det matcher den synlige Figma-reference markant bedre ved både mobilens 66 px og desktopens 158 px samt community og footer. Konklusionen om referenceeksportens optiske størrelse er empirisk; Figma-rendererens interne aksebehandling er ikke verificeret.

Konkrete rettelser:

- Fjernet tvungen opsz 14 og eksplicitte variations-overrides. CSS-vægte styrer fortsat de korrekte vægte; `font-synthesis: none` forhindrer syntetisk fed.
- Beholdt Figma-aflæste fontstørrelser og linjehøjder. Der er ingen tekstskalering, fontsubstitution eller ændret tracking for at skjule forskelle.
- Rettet nedtællingens labelafstande til Figma-tekstens faktiske mellemrum, separat for desktop og mobil.
- Rettet galleripilenes venstre indrykning til 23 px i de statiske pilleformer.
- Givet mobilnavigationen korrekt DOM-rækkefølge: Events → Om os → Ny her? → Kontakt. Desktop beholder sin egen rækkefølge. Kun én navigation er synlig/fokusérbar ad gangen.

Ændret applikationskode: `src/styles/global.css`, `src/components/Header.astro`, `src/components/Hero.astro`. JavaScript-logikken er uændret. Teknisk dokumentation og README er opdateret.

## Hele mobilreferencen

Figma-parent `757:2326` er 390×844 og klipper indholdet, som ligger i `757:2327` med højden 2792 px. Til QA blev en midlertidig kopi af indholdet eksporteret uden denne parent. Kopien (`816:1717`) blev slettet bagefter. Originalen blev ikke ændret, og der blev ikke ændret størrelser, indhold eller layout for at skabe referencen.

Der findes nu en [fuld mobilreference](qa/final/figma-390-full.png), og alle fem sektioner er direkte gennemgået, inklusive galleri, community, CTA og footer under folden. Desktopreference `753:847` er også hentet på ny. Den aktive Figma-page har kun forsideframes ved 390 og 1440 px.

## Før-/efter-screenshots

| Bredde  | Før                                             | Efter                                      | Figma / sammenligning                                                                                                                        |
| ------- | ----------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 390 px  | [Hele siden før](qa/final/before/site-390.png)  | [Hele siden efter](qa/final/site-390.png)  | [Figma 390×2792](qa/final/figma-390-full.png) · [Overlay](qa/final/overlay-390-full.png) · [Difference ×4](qa/final/difference-390-full.png) |
| 768 px  | [Hele siden før](qa/final/before/site-768.png)  | [Hele siden efter](qa/final/site-768.png)  | Responsiv kontrol; ingen godkendt frame ved 768 px                                                                                           |
| 1440 px | [Hele siden før](qa/final/before/site-1440.png) | [Hele siden efter](qa/final/site-1440.png) | [Figma 1440×3088](qa/final/figma-1440.png) · [Overlay](qa/final/overlay-1440-full.png) · [Difference ×4](qa/final/difference-1440-full.png)  |

Alle kodebilleder er taget i headless Chrome med device scale factor 1 efter indlæsning af fonte og dekodning af billeder. Fotos er desuden gennemgået visuelt for korrekt kilde, proportioner, beskæring og synlig kvalitet. De samme 14 autentiske Figma-assets og WebP-optimeringer er bevaret; originale PNG-eksporter ligger stadig i `docs/source-assets`. Billeddata fremgår af [assetmapping](figma-assets.json) og [optimeringsrapport](qa/asset-optimization.json).

| Fuldsidemål                                     | Før    | Efter  |
| ----------------------------------------------- | ------ | ------ |
| 390: gennemsnitlig absolut kanalforskel /255    | 6,26   | 2,46   |
| 390: pixels med mindst én kanalforskel over 30  | 5,13 % | 2,43 % |
| 1440: gennemsnitlig absolut kanalforskel /255   | 4,44   | 2,17   |
| 1440: pixels med mindst én kanalforskel over 30 | 3,50 % | 1,63 % |

[Maskinlæsbare mål](qa/final/visual-metrics.json). Tallene påvirkes af fotokomprimering og antialiasing og er diagnostik, ikke et selvstændigt beståelseskriterium. Før-billeder og de oprindelige QA-filer er bevaret.

## Layoutkontrol

| Sektion          | 1440 px top / højde, Figma og kode | 390 px top / højde, Figma og kode |
| ---------------- | ---------------------------------- | --------------------------------- |
| Navigation       | 0 / 116                            | 0 / 144                           |
| Hero             | 0 / 1000 inklusive navigation      | 144 / 690                         |
| Intro og galleri | 1000 / 1045                        | 834 / 692                         |
| Community        | 2045 / 758                         | 1526 / 874                        |
| Footer           | 2803 / 285                         | 2400 / 392                        |

Totalhøjderne er 3088 px på desktop og 2792 px på mobil. Ved 768 px vokser community-kortet med tekstindholdet; hele siden er 3109,5 px før screenshotafrunding. Tablet er gennemgået fra navigation til footer med 32 px sidemargin, fleksible kolonner og mindre typografi. Ingen synlig tekstklipning, overlap eller vandret dokument-overflow blev fundet ved de tre testbredder. Galleriets tilsigtede vandrette scroll er bevaret.

## Build og regressionstests

Den afsluttende [Astro-build](qa/final/build.log) består med Node 22.23.4 og Astro 7.4.8. Én statisk route er bygget. [Browserresultater](qa/final/browser-results.json) og [interaktionsresultater med Chrome-version](qa/final/interaction-results.json) dokumenterer:

| Kontrol                                         | 390     | 768     | 1440    |
| ----------------------------------------------- | ------- | ------- | ------- |
| JavaScript-fejl                                 | 0       | 0       | 0       |
| Fejlede HTTP-svar i interaktionstesten          | 0       | 0       | 0       |
| Vandret dokument-overflow                       | Nej     | Nej     | Nej     |
| Billeder dekodet                                | Alle    | Alle    | Alle    |
| Axe A/AA-fund, forside / åben dialog            | 0 / 0   | 0 / 0   | 0 / 0   |
| Synlige kommende-side-links testet med Enter    | 11      | 12      | 12      |
| Luk med knap/Enter eller Escape og fokusretur   | Bestået | Bestået | Bestået |
| Skip-link, logo og synlig navigationsrækkefølge | Bestået | Bestået | Bestået |
| Tastaturpil ruller galleriet                    | Bestået | Bestået | Bestået |
| Reduced-motion-konfiguration                    | Bestået | Bestået | Bestået |

Testharness blev undervejs korrigeret til at bruge synlig tekst frem for skjulte tekstnoder og til at håndtere Chromes Tab-skift til browserens egen grænseflade. Der blev ikke indført en specialbygget fokustrap for at tilfredsstille testen; native dialog er bevaret. Kopier af de anvendte test-/sammenligningsscripts ligger i `qa/final/scripts` og bruger det isolerede QA-værktøjssæt i `/tmp/kinddesign-tools`, som ikke er en app-dependency.

## Resterende afvigelser og grænser

1. **Små rasterforskelle:** Figma PNG og Chrome har enkelte tekstbaseline-/antialiasingforskelle, cirka 1–2 px på enkelte tekstlinjer. WebP-fotopixels afviger fra PNG-originalerne. De tidligere væsentlige forskelle i bogstavbredder er fjernet; bitidentisk rendering hævdes ikke.
2. **Renderingmiljø:** Kodebilleder er konsekvent fra samme Chrome. Figma-værktøjets rasterisering kan ikke verificeres som samme renderer. Dette begrænser en streng pixelidentisk godkendelse.
3. **768 px:** En godkendt reference ved denne bredde findes ikke blandt de aktive forsideframes. Tablet-layoutet er testet og dokumenteret, men kan ikke tildeles et 1:1-match.
4. **Fase 1-navigation:** Klik og Enter på kommende sider åbner previewforklaringen. Øvrige sider og tilmelding er ikke implementeret. Browserens kontekstmenu »åbn i ny fane« kan fortsat åbne en endnu ikke bygget rute. Dette er bevaret og dokumenteret fasescope, ikke en testet rigtig underside.
5. **Statisk indhold:** Nedtælling, eventdato og pile er fortsat Figma-eksempler/statisk komposition. Ingen automatisk carousel er tilføjet. Der er ingen animation, som starter ved reduced-motion.
6. **Testomfang:** Chrome er testet; skærmlæser, Safari/Firefox, fuld manuel WCAG-audit og Lighthouse er ikke udført. Automatiske nul-fund er ikke en fuld tilgængelighedscertificering.

Der er ikke observeret væsentlige udokumenterede visuelle afvigelser ved slutgennemgangen. Teknisk regressionstest består. Streng 1:1-godkendelse af alle tre bredder kan ikke hævdes på grund af den manglende tabletframe og de beskrevne renderinggrænser.

## Kodeforståelse og faseafgrænsning

`index.astro` samler Header, Hero, Carousel, Community og Footer i BaseLayout. CSS styrer komponenternes layout; fontens optiske akse tilpasses nu automatisk. To navigationsblokke løser forskellig læse-/tabrækkefølge uden ekstra JavaScript. Den eksisterende DOM-listener åbner HTML-dialogen. Se [den faglige dokumentation](dokumentation.md).

Kun fase 1 er ændret. Ingen database, andre sider, automatisk carousel, Netlify-forbindelse, push, merge eller deployment er udført. En senere fase kræver fortsat gruppens godkendelse.
