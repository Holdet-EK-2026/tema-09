# Fase 1 – forside og kvalitetssikring

9. november 2026 · Branch: `feature/fase-1-forside` · Kun lokalt arbejde.

**Status: Forsiden er implementeret og testet. Visuel 1:1-godkendelse er ikke opnået. Synlige typografiske afvigelser skal afklares før fase 2.**

## Implementerede filer og komponenter

| Fil                                 | Funktion                                                              |
| ----------------------------------- | --------------------------------------------------------------------- |
| `src/pages/index.astro`             | Samler den eneste implementerede side                                 |
| `src/layouts/BaseLayout.astro`      | HTML-dokument, dansk sprog, metadata, fonte, CSS og previewdialog     |
| `src/components/Header.astro`       | Desktop- og mobilnavigation med originallogo                          |
| `src/components/Hero.astro`         | Responsive fotos, overskrift, CTA og statiske eksempeldata            |
| `src/components/Carousel.astro`     | Introduktion, statisk Figma-komposition og almindeligt vandret scroll |
| `src/components/Community.astro`    | Foto, communitytekst og CTA                                           |
| `src/components/Footer.astro`       | Footer efter begge Figma-kompositioner                                |
| `src/scripts/navigation.js`         | Dialog ved klik til de kommende sider                                 |
| `src/styles/global.css`             | Tokens, typografi, layout, fokusmarkering og breakpoints              |
| `astro.config.mjs`                  | Statisk Astro-output                                                  |
| `package.json`, `package-lock.json` | Astro 7.4.8 og reproducerbar dependency-installation                  |
| `.nvmrc`, `.gitignore`              | Node-version og udelukkelse af build, dependencies og miljøfiler      |
| `netlify.toml`                      | Lokal konfigurationsforberedelse til fase 5                           |
| `README.md`                         | Startkommandoer, status og struktur                                   |
| `docs/dokumentation.md`             | Teknologivalg, udført arbejde og kodegennemgang                       |
| `docs/figma-assets.json`            | Mapping af Figma-assets, uden midlertidige download-URL'er            |
| `docs/source-assets/`               | 14 bevarede PNG-originaleksporter                                     |
| `public/images/`, `public/fonts/`   | 14 optimerede billeder, to variable fonte og to OFL-licenser          |
| `docs/qa/`                          | Buildlog, screenshots, overlay, difference og testresultater          |

Ingen React, Tailwind, egen TypeScript, database eller andre sider er tilføjet. Ingen carousel-animation eller offentlig deployment er udført.

## Anvendte Figma-assets

| Anvendelse              | Node                             | Lokal fil i `public/images`                                                        |
| ----------------------- | -------------------------------- | ---------------------------------------------------------------------------------- |
| Hero desktop            | `753:849`                        | `0bb08.webp`                                                                       |
| Logo i header og footer | `753:852`, `753:895`, `757:2330` | `af5ee.webp`                                                                       |
| Desktopkort 1–6         | `753:875`–`753:880`              | `04de3.webp`, `1124d.webp`, `60cf8.webp`, `de95f.webp`, `039da.webp`, `ae42c.webp` |
| Community-foto          | `753:888`, `757:2364`            | `ca544.webp`                                                                       |
| Hero mobil              | `757:2341`                       | `1207b.webp`                                                                       |
| Mobilkort 1–4           | `757:2358`–`757:2361`            | `45ced.webp`, `adb04.webp`, `4c7ac.webp`, `e2097.webp`                             |

Ingen erstatningsbilleder er anvendt. Brødtekst: **DM Sans**, 400; desktopnavigation: 700. Overskrifter: **Bricolage Grotesque**, 700, breddeakse 100. Optisk størrelse 14 som i Figma. Fonte fra det officielle Google Fonts-repository og lokale OFL-licenser.

## Build og browserchecks

`npm run build` bestod med Node 22.23.4 og Astro 7.4.8: statisk output, én route (`/index.html`). Den konkrete log er [qa/build.log](qa/build.log).

Testet i headless Google Chrome på macOS, device scale factor 1, mod den lokalt byggede side. Fontindlæsning og billeddekodning var færdige før screenshots. Lazy loading blev slået til eager i QA-browseren alene for at sikre fuldsidescreenshots.

| Check                                   | 390 px | 768 px | 1440 px |
| --------------------------------------- | ------ | ------ | ------- |
| JavaScript-fejl                         | 0      | 0      | 0       |
| Vandret dokument-overflow               | Nej    | Nej    | Nej     |
| Billeder indlæst                        | Ja     | Ja     | Ja      |
| Automatisk axe WCAG A/AA-fund           | 0      | 0      | 0       |
| Hero-CTA åbner forklaring               | Ja     | Ja     | Ja      |
| Escape lukker dialog og gendanner fokus | Ja     | Ja     | Ja      |
| Tastaturpil ruller galleriet            | Ja     | Ja     | Ja      |

Se [qa/browser-results.json](qa/browser-results.json) for billedgeometri, indlæste fonte og testdata. Ingen fuld skærmlæsertest, manuel WCAG-audit eller Lighthouse-test er gennemført. Der er ingen animation i fase 1; reduceret bevægelse medfører derfor ingen autoplay.

## Screenshots

- [390 px – hele siden](qa/site-390.png)
- [390×844 – referenceviewport](qa/site-390-viewport.png)
- [768 px – hele siden](qa/site-768.png)
- [1440 px – hele siden](qa/site-1440.png)

## Direkte visuel sammenligning

Desktopreference: [Figma 1440×3088](qa/figma-1440.png), [50 % overlay](qa/overlay-1440.png), [difference ×4](qa/difference-1440.png).

Mobilreference: [Figma 390×844](qa/figma-390.png), [50 % overlay](qa/overlay-390.png), [difference ×4](qa/difference-390.png).

Billedsammenligningen er gennemført i flere runder. Desktopnavigationens startposition blev rettet fra 521 til 480 px. Mobilens teksthøjder og sektionsplaceringer blev rettet ud fra aflæste Figma-lag. Google Fonts' statiske filer blev afprøvet og erstattet med de variable originalfonte; familier, vægte og akser blev også kontrolleret i browseren. Dette løste ikke forskellen i glyfformer og tekstbredder.

Figma-værktøjets PNG-rendering og Chromes fontrendering kan ikke bekræftes at være samme renderingmiljø. Alle kode-screenshots bruger samme Chrome-miljø; Figma-referencebillederne er værktøjseksporter. Kravet om ét verificeret, fælles renderingmiljø for Figma og kode er dermed ikke fuldt opfyldt.

### Geometri

| Sektion          | Figma desktop top/højde        | Kode desktop top/højde         | Figma mobil top/højde | Kode mobil top/højde |
| ---------------- | ------------------------------ | ------------------------------ | --------------------- | -------------------- |
| Navigation       | 0 / 116                        | 0 / 116                        | 0 / 144               | 0 / 144              |
| Hero             | 0 / 1000, inklusive navigation | 0 / 1000, inklusive navigation | 144 / 690             | 144 / 690            |
| Intro og galleri | 1000 / 1045                    | 1000 / 1045                    | 834 / 692             | 834 / 692            |
| Community        | 2045 / 758                     | 2045 / 758                     | 1526 / 874            | 1526 / 874           |
| Footer           | 2803 / 285                     | 2803 / 285                     | 2400 / 392            | 2400 / 392           |

### Resterende konkrete afvigelser

1. **Typografi:** Overskriftens glyffer og tekstbredder afviger synligt. Eksempelvis er mobilens `DESIGN` bredere i Chrome end i Figma PNG; hero-, community- og footeroverskrifter viser forskelle i overlay. Brødtekst har også mindre forskelle i bredde og rasterisering. De aflæste fontfamilier, størrelser, vægte og akser er bevaret. Dette er en væsentlig, uløst afvigelse.
2. **Tekstombrydning:** Community-brødtekstens linjeskift på desktop afviger enkelte steder fra referenceeksporten. Enkelte knaptekster og nedtællingens labels/afstande er heller ikke pixelidentiske. Samme sektionshøjde betyder ikke identisk indhold inden i sektionen.
3. **Fotopixels:** WebP-komprimering og nedskalering giver små billedforskelle. Billedkilder, billedpladser og proportioner er kontrolleret; optimeringen er ikke tabsfri.
4. **Mobil under folden:** Mobilens parentframe klipper ved 844 px. Forsøg på at eksportere hele indholdet gav stadig 844 px; en sektion under folden gav kun den synlige rest på 10 px. Der er derfor ikke lavet direkte fuldsideoverlay for mobil. De fulde lagværdier er aflæst, og sektionstoppe og -højder matcher, men det er ikke en visuel godkendelse af indholdet under folden.
5. **Tablet:** Ingen godkendt 768 px-frame blev identificeret. Tablet bruger flydende kolonner, 32 px margener og mindre tekst. Det er testet responsivt, men har intet påstået 1:1-match.
6. **Interaktion i fase 1:** Pile er statisk grafik. Eksempelnedtællingen er statisk. Kommende navigation åbner en forklaringsdialog, som er en previewtilpasning og ikke en Figma-designet ekstra side. Browserens »åbn link i ny fane« kan stadig åbne en fremtidig, manglende rute.

Difference-mål: desktop har gennemsnitlig absolut kanalforskel **4,44/255**, og **3,50 %** af pixels har mindst én farvekanal med forskel over 30. Mobilviewport: **8,09/255** og **5,17 %**. Dette er diagnostik, ikke et beståelseskriterium; fotos og antialiasing påvirker målene. Se [qa/visual-metrics.json](qa/visual-metrics.json).

## Mobilstatus

Den specifikke mobilkomposition er implementeret, inklusive andet hero-foto, korrekt to-rækkers navigation, fuldbredde-CTA, gallerifotos og salviefarvet community. Dokumentbredden er 390 px og totalhøjden 2792 px, som Figma-indholdet. Ingen billeder er erstattet af desktopbilleder i mobilens synlige pladser. Typografi og direkte visuel kontrol under folden er fortsat åbne punkter.

## Kodegennemgang og næste skridt

`index.astro` samler sektionerne. BaseLayout leverer dokument og fælles ressourcer. CSS Grid fordeler kolonner; Flexbox stabler indhold; media queries vælger mobilkomposition. `navigation.js` finder DOM-links, tilføjer event listeners og åbner den native HTML-dialog. Fotogalleriets scroll kræver ingen carouselkode. Se den uddybede, faglige gennemgang i [dokumentation.md](dokumentation.md).

Første næste skridt er at afklare font-/renderingsforskellen og etablere en fuld mobilreference under samme verificerbare renderingbetingelser. Der er ikke erklæret visuel godkendelse. Når fase 1 senere er godkendt, er næste implementeringsfase **fase 2: automatisk carousel**. Den nævnte referencevideo er ikke tilgængelig blandt de identificerede projektfiler i denne arbejdsgang og skal være tilgængelig før den fase. Arbejdet stopper her; fase 2–6 er ikke startet.

## GitHub-status

GitHub-connectoren viste repository-størrelse 0; `git clone` bekræftede et tomt repository. Der findes derfor ingen eksisterende main-commit som PR-base. Arbejdet er versioneret på den lokale orphan-featurebranch. Ingen push, PR, merge, ændringer på main, Netlify-forbindelse eller publicering er udført.
