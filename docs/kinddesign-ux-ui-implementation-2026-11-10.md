# KindDesign – UX/UI implementation

Startet 10. november, afsluttende QA 11. november 2026. Filnavnet følger den bestilte leverance. Lokal featurebranch `feature/ux-ui-refinement`. Ingen push, merge eller deployment.

## 1. Executive summary

De dokumenterede lokale rettelser er gennemført batch for batch med auditten som autoritativ opgaveliste. Headeren holder sin navigation inden for 320–2560 px, eksplicit Play virker med bevaret fokus, aktiv navtekst har tilstrækkelig kontrast, og hero/eventkort kan tilpasses uden afklipning eller billedbetingede hop.

Events prioriterer kommende arrangementer, arkivet er bevaret, kalenderens månedsvalg kommer før eventfeature/foto, og intern tilbage-navigation bevarer filtre eller kalendermåned. Der er ét semantisk link pr. eventkort. Tokyo-eventets pris og krav om godkendelse er genverificeret og synlige ved CTA'en. Billedvarianter og proportioner er forbedret uden at erstatte autentiske motiver eller ændre fontfiler.

**13 fund er rettet og verificeret, 2 afventer ejeroplysninger/beslutning, og 1 er bevidst fravalgt.** Kontaktens demo og global noindex er bevaret. Den publicerede Netlify-version er ikke opdateret af denne opgave.

## 2. Grundlag og baseline

Udgangspunkt: `db42f51da83028fffec9e2df8d2f597ac77154b3` på `feature/ux-ui-final-qa`, med auditrapport/evidens som eksisterende untracked arbejde. Det blev bevaret i et særskilt dokumentationscommit på den nye branch. Ingen urelaterede ændringer er overskrevet.

Primær kilde: [den komplette audit](kinddesign-ux-ui-deep-audit-2026-11-10.md). Tidligere fase-/UX-QA og teknisk dokumentation er læst; der er ikke startet en ny generel audit. Skills `website-qa-director`, `mmd-design-reviewer`, `ai-slop-auditor` og `mmd-figma-style` er anvendt selektivt til test/evidens, visuel kontrol og bevarelse af projektidentitet. Ingen nye inspirationsretninger, forskningsresultater eller påstande om AI-forfatterskab er tilføjet.

Baseline: [auditens screenshots](qa/deep-audit-2026-11-10/), [udvalgte førbilleder](qa/implementation-2026-11-10/before/) og ni nye lokale Lighthouse-førmålinger. Testbuilds er isoleret i `/tmp/kinddesign-refinement`, så et tidligere preview på 4321 ikke skulle stoppes eller overtages. Den nye lokale statiske production build testes på port 4323. Node 22.23.4, Astro 7.4.8 og eksisterende isolerede Playwright/Chrome, axe og Lighthouse er genbrugt. Ingen dependencies er tilføjet.

Figma-headers fra auditten er sammenholdt med nye screenshots. Palet, Bricolage/DM Sans, optisk størrelse og dokumenterede 107/116 px headerhøjder er bevaret. Der hævdes ikke ny fuldside-pixelidentitet mod alle Figma-frames.

## 3. Status for alle 16 auditfund

| ID | Slutstatus | Ændring, beslutning og verificering |
| --- | --- | --- |
| KD-01 | **Rettet og verificeret** | Navens 895 px grid inkluderer CTA'ens margin i pladsberegningen; det voksende brede navgap er fjernet. 70 kontroller på fem sider ved 14 bredder inklusive 1441/1536/1600/1920/2560: ingen overflow, skjult CTA eller logooverlap. Ingen body-overflow skjult. |
| KD-02 | **Rettet og verificeret** | Eksplicit Play overstyrer fokuspausen i den aktuelle fokusindgang; en ny indgang stopper igen. Fokus fjernes ikke. Pointerdown bevarer knappens handling før klikfokus, og keyboard Play/Pause følger faktisk state. To reelle skift efter Play består ved 390/768/1440; øvrige pauser, swipe og loop består. |
| KD-03 | **Rettet og verificeret** | Heroens eventsummary/countdown er i flow med minimumshøjder. Talgrupper ligger separat, så øget tracking ikke afklipper sidste tidsgruppe. Test med de fire krævede tekstafstande består ved 320/390/768/1440. Normale herohøjder er stadig 690/1000 px. |
| KD-04 | **Blokeret af ekstern afhængighed** | Eksisterende projektdokumentation indeholder ingen verificeret officiel mail/telefon. Casebeskrivelsen identificerer en officiel Instagram-profil, som er tilføjet som et almindeligt “Find”-link. DM-/indbakkeadgang er ikke verificeret, og ingen mailadresse eller afsendelsesintegration er opfundet. Kontaktens ærlige demomærkning og feedback er bevaret. Ejer skal bekræfte en faktisk kontaktkanal. |
| KD-05 | **Rettet og verificeret** | Kalenderens rækkefølge er titel/intro → visningslinks → månedsvalg/gitter → sekundært eventfeature/foto. Månedsvalg og begyndende gitter er synlige ved 390×844 og 1440×900; måned, reload, history og detaljelinks består. |
| KD-06 | **Rettet og verificeret** | Kommende er standard. Alle datoer/arkiv og alle otte officielle poster er bevaret. Synlig overskrift og antal viser den valgte opgave. Ingen kommende giver forklarende tomtilstand med arkiv- og Luma-vej; efter udløb kan alle otte findes som tidligere. Alle 12 kombinationer består. |
| KD-07 | **Rettet og verificeret** | `returnTo` følger med almindelige links. Detaljen validerer kun lokale Events-/kalenderstier og kendte parametre; fallback er `/events/`. Filtre, måned, reload og browser Back består; eksterne/ukendte retur-URL'er afvises. |
| KD-08 | **Rettet og verificeret** | Desktopmedia reserverer et kvadratisk slot; `contain` bevarer hele coveret. Mobil bevarer 300 px medieplads. Rigtige intrinsiske dimensioner bruges. Gate/forsinkelse af alle covers giver identisk kortgeometri før/efter decode ved 390/768/1440. |
| KD-09 | **Rettet og verificeret** | Hvert kort har ét almindeligt anchor med titel som accessible name, og CTA'en er et visuelt span i samme link. Ingen nested anchors eller click-handlers på divs. Otte eventdestinationer giver otte linkstop i arkivvisningen. |
| KD-10 | **Rettet og verificeret** | Ved 1440 starter nav x480 og CTA x1210 på hovedsiderne. V2-nav flyttes 4,5 px ned til samme optiske linje. Logo 90×90, CTA 165×56 og headerhøjder bevares. Den tidligere dokumenterede konsolidering til 165 px CTA på Ny her er bevaret og ikke en ny vilkårlig størrelse. |
| KD-11 | **Rettet og verificeret** | Luma er genlæst 10. november: Tokyo 13. november, JP¥1.000, Approval Required/Request to Join. CTA siger “Anmod om plads via Luma”. Krav/kontroldato vises og skjules efter udløb. Ingen reservation. Redaktionel vedligeholdelsesrutine er dokumenteret. |
| KD-12 | **Blokeret af ekstern afhængighed** | De 12 demoruter og historikken er bevaret. Dokumentationen afventer ejerens produktions-/domæne-/indekseringsbeslutning. Global `noindex,nofollow` ændres ikke. Forslag til offentlig/preview-/eksamensafgrænsning er dokumenteret, ikke gennemført. |
| KD-13 | **Rettet og verificeret** | Nye responsive varianter til hero/Ny her/banner/logo og konservativ komprimering. 30 DPR1/DPR2-kontroller samt tre før-/eftermålinger pr. scenarie. Originale billed-/fontfiler er hashkontrolleret uændrede. Mobil-LCP er forbedret, men er fortsat over 2,5 s. |
| KD-14 | **Rettet og verificeret** | V2-billedlaget bruger `cover` med `object-position:center 35%` frem for `fill`. Samme foto, proportioner bevaret, motiv/tekst visuelt sammenholdt ved 390/768/1440 og DPR1/2. Det er en dokumenteret kompositionsjustering mod den tidligere strakte reference. |
| KD-15 | **Bevidst fravalgt med begrundelse** | Den valgfrie tekstomskrivning har ikke tilstrækkelig ny indholdsevidens. Den godkendte personlige tone og eksisterende tekst bevares; ingen nye løfter eller deltagelsesoplysninger opfindes. |
| KD-16 | **Rettet og verificeret** | Aktiv navtekst bruger eksisterende `--tekst`. Kontrast på salvie er 8,20:1; på lyseblå 13,78:1. Underline, 240 ms hover og synligt fokus er bevaret. Faktiske browserfarver kontrolleres på mobil/desktop. |

## 4. Implementering og ændrede komponenter

- **Navigation/carousel:** `Header.astro`, `Footer.astro`, `global.css`, `carousel.js`. Den kompakte kontrols visuelle rækkefølge er bevaret; Play er nu brugbar både ved pointer og tastatur, og en besked forklarer midlertidig hover-/fokuspause. Almindelig fokusindgang, eksplicit Pause, reduced-motion, offscreen og fane-pause er bevaret.
- **Tilpasning/media:** `Hero.astro`, `countdown.js`, `EventCard.astro`, `pages.css`. Standard-layoutet er bevaret, mens teksten kan vokse. Eventcovers forvrænges/beskæres ikke.
- **Events/kalender:** `events/index.astro`, `events/kalender.astro`, `events.js`, `calendar.js`, `event-navigation.js`, `event-return.js`, `OfficialEventDetail.astro`. Almindelige links og URL-parametre bevares. Retur-kontekst tilføjes progressivt med sikker fallback. No-JS viser alle otte events med forklaring.
- **Luma:** `luma-events.js`, `OfficialEventDetail.astro`, `event-status.js`. Kun aktuelle, genverificerede tilmeldingsoplysninger tilføjes. De eksisterende kildekonflikter om Real-talk-årstal/Berlin-sluttid er stadig synlige; ingen ny sikkerhed om dem er opfundet.
- **Billeder:** Header/footer, Hero/PageHero, Ny her og Events-banner bruger responsive varianter fra de samme kilder. Seks nye filer er tilføjet; originaler er bevaret. En lossless 248 px logo-variant blev afvist, fordi den var større end originalen.
- **Tests:** Eksisterende scripts understøtter `KINDDESIGN_QA_BASE`; buildcheck understøtter `KINDDESIGN_BUILD_DIR`. Nye målrettede tests dækker geometri/kontrast, tekstafstande, forsinkede billeder, filtre/kontekst/sikkerhed og media. Sidematricen er udvidet til slutkontrollen. Ingen ændring i dependencylisten.

## 5. Før-/efter-evidens

Der er faktiske implementerede efterbilleder i denne rapport. De tidligere audittilstande er bevaret uændret.

| Område | Før | Efter |
| --- | --- | --- |
| Header 1920 | [CTA uden for viewport](qa/implementation-2026-11-10/before/header-home-1920.png) | [Hele headeren indenfor](qa/implementation-2026-11-10/batch-a/header-home-1920.png) |
| Tekstafstande 320 | [Afklippet countdown](qa/implementation-2026-11-10/before/text-spacing-hero-320.png) | [Voksende hero](qa/implementation-2026-11-10/batch-b/text-spacing-320.png) |
| Navigation/Figma | [Frisk reference og tidligere live](qa/deep-audit-2026-11-10/references/figma-live-nav-events.png) | [Justeret Events-nav](qa/implementation-2026-11-10/batch-b/header-_events_-1440.png) |
| Events 390 | [Tidligere standardvisning på 7.699 px](qa/implementation-2026-11-10/before/events-390.png) | [Kommende som standard, 2.594 px](qa/implementation-2026-11-10/after/_events_-390.png); arkivet er stadig tilgængeligt. |
| Kontakt 390 | [Kun demo](qa/deep-audit-2026-11-10/pages/_kontakt_-390.png) | [Officiel profil som supplerende vej, demo bevaret](qa/implementation-2026-11-10/contact-followup/_kontakt_-390.png) |
| Kalender 390 | [Feature før værktøj](qa/implementation-2026-11-10/before/calendar-390.png) | [Månedsvalg/gitter først](qa/implementation-2026-11-10/batch-c/calendar-first-390.png) |
| Kalender 1440 | [Månedsvalg under fold](qa/deep-audit-2026-11-10/findings/calendar-first-viewport-1440.png) | [Første viewport](qa/implementation-2026-11-10/batch-c/calendar-first-1440.png) |
| Covers 1440 | [Geometri ændres efter decode](qa/deep-audit-2026-11-10/image-stability.json) | [Identiske før-/efter-rektangler](qa/implementation-2026-11-10/batch-b/refinement-B.json) og [efterbillede](qa/implementation-2026-11-10/batch-b/covers-decoded-1440.png) |
| Heroproportioner | [Samlet før/efter](qa/implementation-2026-11-10/batch-e/hero-proportions-before-after.png) | Samme foto; naturtro proportioner frem for strækning. |
| Bannerkvalitet | [DPR2 original/ny variant side om side](qa/implementation-2026-11-10/batch-e/banner-quality-dpr2-before-after.png) | Motivet og den browserbestemte beskæring er bevaret. |

Carouselens to skift bevises af tidsserier/assertions i [batch A](qa/implementation-2026-11-10/batch-a/carousel.json), ikke af ét statisk billede. [Batchbeskrivelser A–E](qa/implementation-2026-11-10/) dokumenterer mellemresultater.

## 6. Testresultater og regression

**Slutkontrollen består:** production build, `npm test`, hele `test:browser` og den efterfølgende `test:refinement`-pakke er udført. 270 side-/breddekombinationer (27 ruter × 10 bredder) har nul JS-/ressourcefejl, nul vandret overflow og nul automatiske axe-fund i 46 WCAG 2.2-scanninger. Alle synlige billeder indlæses, og hver side har ét h1. De krævede bredder 320/375/390/430/768/1024/1440/1536/1920/2560 er med; headeren har desuden særskilte 601/640/1441/1600-kontroller.

[Slutoversigt](qa/implementation-2026-11-10/after/verification-summary.json), [270 sideresultater og screenshots](qa/implementation-2026-11-10/after/pages.json), [84 målrettede records](qa/implementation-2026-11-10/after/refinement-all.json), [30 mediarecords](qa/implementation-2026-11-10/after/media.json) og [kørselslogs](qa/implementation-2026-11-10/after/logs/).

Den første start af den afsluttende målrettede pakke ramte en Chrome-launch-timeout før assertions. Pakken er gentaget efter genoptagelsen og består. Der er ikke ændret applikationskode for at omgå timeouten.

| Fokusbevarende Play, reel tid | Første / andet skift |
| --- | --- |
| 390 px | 4.400 / 8.897 ms |
| 768 px | 4.407 / 8.908 ms |
| 1440 px | 4.408 / 8.905 ms |

[Endelige carouselresultater](qa/implementation-2026-11-10/after/carousel.json) inkluderer også normalt autoplay, loop, hover/fokus, keyboard, touch og reduced-motion. Scrolling og udgang med pointer følger det faktiske billedrektangel; fokus fjernes ikke i Play-regressionen. De eksisterende [FAQ/navigationstests](qa/implementation-2026-11-10/after/ux-interactions.json), [official flows](qa/implementation-2026-11-10/after/official-flows.json), [demo/kontakt](qa/implementation-2026-11-10/after/flows.json) og [smoke/no-JS/retina](qa/implementation-2026-11-10/after/smoke.json) består.

Efter profilsupplementet er Kontakt genbygget og genkontrolleret ved alle ti bredder, inklusive axe på 390/1440, alle tre kontakt-/demoflows og mobil/desktop Lighthouse. De ti kontaktrecords og to målinger erstatter Kontakt i den samlede matrix; de øvrige uændrede sider er ikke unødigt gentestet. [Supplerende evidens](qa/implementation-2026-11-10/contact-followup/).

Batchresultater:

| Område | Udført evidens |
| --- | --- |
| Header/kontrast | 70 kontroller på 5 sider ved 320/375/390/430/601/640/768/1024/1440/1441/1536/1600/1920/2560. Bestået. |
| Carousel | Originale assertions + nye mus-/keyboard-Play-tests med fokus bevaret. Bestået ved 390/768/1440. To reelle skift efter ca. 4,5/9 sek. |
| Tekstafstande | 1,5 line-height, 2em afsnit, .12em tracking, .16em word-spacing ved 320/390/768/1440. Bestået. |
| Forsinkede covers | Alle covers holdes tilbage til første række ses, derefter decode. Identiske kortpositioner/-højder ved 390/768/1440. |
| Events/kalender/kontekst | 84 samlede målrettede records i batch C, inkl. 12 kombinationer × 3 bredder, intern retur, reload, browser Back, sikre fallback-URL'er og kalender i første viewport. Bestået. |
| Udløb/no-JS | Efter 13. november findes ingen kommende kort; arkivknap viser alle otte. No-JS viser alle otte. Luma-CTA/kalenderbeskyttelse samt vilkår efter udløb består. |
| Eksisterende flows | Officielle events, ICS, fire demo-/kalenderflows og kontaktvalidering/reset består ved 390/768/1440. Ingen POST/booking. |
| Media | 30 scenarier: 5 sider × 3 bredder × DPR1/2. Alle billeder indlæses, rette kilde vælges, ingen `fill`-strækning. |
| Build/statiske checks | Production build og statisk link/asset/h1/ICS/data-kontrol består. |

## 7. Performance og Lighthouse

Ni sammenlignelige lokale målinger før og ni efter, tre pr. scenarie. Samme isolerede serveropsætning, Chrome/Lighthouse, viewport/DPR1 og simuleret netværk/CPU; sekventielt uden konkurrerende browserkørsler.

| Scenarie | Median score før → efter | Median LCP før → efter | Median overførsel før → efter |
| --- | --- | --- | --- |
| Forside mobil | 87 → 90 | 4,128 → 3,677 s | 661.325 → 575.537 bytes |
| Ny her mobil | 88 → 91 | 3,903 → 3,527 s | 546.017 → 460.643 bytes |
| Events desktop | 97 → 99 | 1,284 → 0,942 s | 1.773.595 → 780.372 bytes |

[Medianberegning](qa/implementation-2026-11-10/performance-comparison.json), [rå førmålinger](qa/implementation-2026-11-10/before/performance/), [rå eftermålinger](qa/implementation-2026-11-10/after/performance/).

Events-gevinsten omfatter også standardvisning af kommende i stedet for hele arkivet; den er ikke en isoleret codec-effekt. Banneret alene går fra 566.928 til 38.304 bytes ved DPR1 og 115.540 ved DPR2. Originale billeder/fonte er [hashkontrolleret uændrede](qa/implementation-2026-11-10/preserved-original-assets.json). [Encoding/kildemål](qa/implementation-2026-11-10/image-encoding.json).

Mobil-LCP når ikke 2,5 s i disse profiler. Yderligere optimering må afvejes mod foto-/typografikvalitet; ingen fontfamilie/akse er ændret for en score. Laboratoriedata er ikke felt-INP eller dokumenteret konverteringsløft. SEO forbliver påvirket af det bevidste noindex-valg. Den afsluttende Lighthouse-runde har **16 målinger på otte sider**: performance 90–100, accessibility 100, best practices 100 og CLS 0 i alle målinger. SEO 63 følger fortsat noindex-beslutningen. [Endelig oversigt og rå data](qa/implementation-2026-11-10/after/metrics/lighthouse/summary.json).

| Side | Performance mobil / desktop | Mobil-LCP |
| --- | --- | --- |
| Forside | 90 / 100 | 3,677 s |
| Events | 96 / 99 | 2,777 s |
| Kalender | 100 / 100 | 1,203 s |
| Om | 99 / 99 | 2,075 s |
| Ny her | 91 / 100 | 3,527 s |
| Kontakt | 98 / 99 | 2,476 s |
| Tokyo-detalje | 100 / 100 | 1,052 s |
| AI skillsharing | 100 / 100 | 1,052 s |

## 8. Accessibility

Aktiv navtekst bruger et eksisterende kontraststærkt token. Underline og 3 px focus-visible er bevaret, og mobilens fire synlige links er uændrede. Ingen ny hamburger/sticky/shrinking header er indført. Taborden og visuel rækkefølge følger hinanden; hvert eventkort har ét meningsfuldt linknavn.

Heroen består de krævede tekstafstandsændringer, og eventcovers giver ikke længere det reproducerede billedbetingede layoutskift. Carouselens eksplicitte Play respekterer fokus, mens en almindelig fokusindgang fortsat stopper rotation. FAQ-accordion og dens svar er ikke ændret.

46 automatiske axe-scanninger med WCAG 2.2-tags har nul fund i sidematricen; testede FAQ-/formular-/carouseltilstande har ligeledes nul automatiske fund. Lighthouse-a11y er 100 i alle 16 slutmålinger. Fokus og navkontrast er desuden browsermålt i 70 kontroller.

**Native Chrome-zoom:** 200 % på seks centrale sider og 400 % på samme sider plus Tokyo: 13 aflæsninger, ingen vandret overflow. Den midlertidige fuldskærm gav 1470 CSS-px som udgangspunkt; 200 % gav 735 og 400 % 367 CSS-px. Rigtig scrolling ved 400 % fungerede. Zoom blev gendannet til 100 %, oprindelig vinduesstørrelse 837×684 CSS-px gendannet og auditfanen lukket. [Dokumentation](qa/implementation-2026-11-10/after/native-zoom.json).

**Safari/Firefox:** Safari er installeret, men WebDriver afviste sessionen, fordi “Allow remote automation” er deaktiveret, og computeradgangen til Safari blev også afvist. Ingen indstilling/tilladelse er ændret. Safari er derfor **ikke testet**. Firefox er ikke installeret i den tilgængelige opsætning. [Begrænsninger og gentaget Chrome-start](qa/implementation-2026-11-10/after/browser-limitations.json). Automatiske nul-fund er ikke fuld WCAG 2.2 AA-konformitet. Kontrast over alle mulige fotobaggrunde og rigtig skærmlæseroplæsning er ikke fuldt verificeret.

## 9. Eksterne afhængigheder og lanceringsvalg

[Detaljeret beslutningsnotat](qa/implementation-2026-11-10/batch-d/launch-decisions.md).

- **KD-04:** En direkte indbakke/mailkanal mangler stadig. Casebeskrivelsens officielle Instagram-profil er tilføjet og linkdestinationen kontrolleret med lokal interception; det er ikke en test af beskedlevering på Instagram. [Kildegrundlag](qa/implementation-2026-11-10/batch-d/contact-source.json). Kontaktformularen forbliver en ærlig prototype; der er ingen ny afsendelsesintegration og ingen besked sendt.
- **KD-12:** 12 direkte demoruter bevares til eksamen/proces. Ingen godkendt offentlig-/preview-/indekseringspolitik findes endnu. Alle 14 normale hovedruter + 404 og demoer har fortsat global noindex; ingen historiske filer er slettet eller flyttet.
- **Luma:** [Aktuel kontrol](qa/implementation-2026-11-10/luma-reverification.json) er read-only. Pris/krav kan ændres og skal vedligeholdes før kommende builds. Arrangøren skal afklare de allerede dokumenterede historiske konflikter. Ingen betaling, tilmelding eller databaseændring.
- **Publicering:** Sidst dokumenterede publicering er deploy `6af34a2e5ac8ad72cd7e9c25`; den offentlige version er ikke genverificeret i denne lokale opgave. Denne opgave har ikke kontaktet Netlify for at udgive noget. Eksplicit ny godkendelse kræves før push/deployment.

## 10. Kendte begrænsninger

- Kontakt og indeksering er ikke “løst” ved at opfinde et backendflow eller fjerne beskyttelse.
- Manuelt eventkatalog henter ikke automatisk nye events. Udløbsbeskyttelse er testet, men redaktionel opdatering/genbygning er stadig nødvendig.
- Ingen repræsentativ brugertest, fysisk telefon, felt-INP eller fuld manuel skærmlæseraudit. Chrome-touch er emulation. Native Chrome-zoom er udført; Safari-/Firefox-begrænsningerne står ovenfor.
- Lighthouse er laboratoriemålinger. De tre medianer før/efter er sammenlignelige indbyrdes; de skal ikke direkte sammenlignes med tidligere liveaudit på en anden serverprofil.
- Naturlige hero-proportioner kræver en let justeret beskæring mod den tidligere strakte Figma-orienterede kode. Afvigelsen er eksplicit dokumenteret og bruger samme billede.
- KD-15 er valgfri og bevidst fravalgt. Ingen generaliseret indholdsoprydning eller nyt design er indført.

## 11. Lokale commits

| Commit | Indhold |
| --- | --- |
| `f56afdd` | Bevarer den komplette audit og dens evidens som baseline. |
| `e9a45f0` | Batch A: header, fokusbevarende Play, aktiv kontrast, regression. |
| `583f1c3` | Batch B: voksende hero/countdown, stabile covers, optisk alignment. |
| `65f6690` | Batch C: kommende/arkiv, kalender, sikker retur-kontekst, ét kortlink. |
| `e297b45` | Batch D: verificerede Luma-vilkår og dokumenterede ejerafhængigheder. |
| `8293c54` | Batch E: responsive autentiske billeder og naturlige heroproportioner. |
| `1dd5dbb` | Dokumenteret officiel Instagram-profil, bevaret kontaktdemo og test af linkdestination. |

Afsluttende tests og denne rapport gemmes i et særskilt lokalt QA-/dokumentationscommit; dets hash oplyses i leveringsbeskeden og findes i Git-loggen. Ingen af disse commits er pushet eller merged.

## 12. Gentagelse

Brug projektets Node-version og eksisterende QA-tools. Den lokale isolerede build kan testes med `KINDDESIGN_QA_BASE`, `KINDDESIGN_QA_OUTPUT` og `KINDDESIGN_BUILD_DIR` uden at overskrive historiske QA-resultater.

- `npm run build -- --outDir /tmp/kinddesign-refinement/after-dist`
- `KINDDESIGN_BUILD_DIR=/tmp/kinddesign-refinement/after-dist npm test`
- `KINDDESIGN_QA_BASE=http://127.0.0.1:4323 npm run test:browser`
- `KINDDESIGN_QA_BASE=http://127.0.0.1:4323 npm run test:refinement`
- `KINDDESIGN_QA_BASE=http://127.0.0.1:4323 npm run test:lighthouse`

Angiv også en ny `KINDDESIGN_QA_OUTPUT`-mappe. Den anvendte server er en lokal statisk server for buildartifactet, ikke en deployment. Tre-før/efter-harness og logs bevares som dokumentation.

## 13. Anbefalet næste skridt

Gennemgå den lokale version med den verificerede ændrings-/evidensoversigt. Afklar en officiel kontaktkanal og produktionspolitik for demoer/noindex med ejeren. Få historiske Luma-kildekonflikter afklaret, og planlæg simpel vedligeholdelse efter Tokyo-eventet. Supplér med relevante rigtige brugere og manuel hjælpemiddeltest før en professionel lancering.

Publicering er en særskilt opgave. Denne leverance afsluttes lokalt med en samlet teststatus og commits; den sender ingen kode til GitHub eller Netlify.

## 14. Afslutning

Alle 16 KD-fund har en dokumenteret slutstatus. De 13 lokale rettelser består batch- og slutkontrol. KD-04/KD-12 afventer ejer, og KD-15 er bevidst fravalgt. Originale assets, historik og demoindhold er bevaret. Der er ikke observeret nye kritiske regressioner. Slutleverancen er lokal; Git-status kontrolleres efter QA-committet.
