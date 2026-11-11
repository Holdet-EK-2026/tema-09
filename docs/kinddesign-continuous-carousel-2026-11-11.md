# KindDesign – kontinuerlig uendelig 3D-carousel

11. november 2026 · lokal branch `feature/continuous-3d-carousel` · kodecommit `0a23e9b`. Ingen push, merge eller deployment.

## Reference og implementering

[LG BioCapital](https://lgbiocapitalpartners.com/) er undersøgt i den rigtige Chrome-browser. Den synlige logostribes `.publication-track` har computed animation `34s linear infinite logo-marquee`. [Browserobservation](qa/continuous-carousel-2026-11-11/reference.json). Princippet er konstant translation gennem en gentaget sekvens uden ophold.

KindDesigns gamle 4,5-sekunders timeout/800 ms slide-overgang er erstattet af én `requestAnimationFrame`-løkke i den eksisterende `carousel.js`. En kontinuerlig fase bevæger sig lineært med **12 sekunder pr. kort**, svarende til 72 sekunder pr. fuld omgang. Der er ingen autoplay-timeout og ingen simulering med hurtige slideskift.

Afstanden til midten styrer transform, dybde, rotation og scale gradvist. Kortene overlapper, og de eksisterende glasrammer, autentiske billeder og kontroller genbruges. Seks kort cirkulerer; kanten genbruges ved nul opacity, uden kloner eller synlig passage gennem centrum. CSS-transition er slået fra for kontinuerlige kort, så browseren ikke interpolerer mod nye diskrete mål. Skærmlæseren eksponerer det nærmeste kort; manuelle skift annonceres separat.

Bevægelse starter ved mindst 25 % synligt billedvindue. Aktiv pointerbevægelse over billederne, fokusindgang, drag, Pause, reduced-motion, skjult dokument og offscreen stopper automatikken. Afspil virker med knapfokus bevaret og overstyrer hover/fokus i samme fokusindgang. Ny fokusindgang beskytter igen. Pile, piletaster og swipe stopper automatikken og flytter manuelt til et kort; Afspil fortsætter fra den aktuelle position. Reduced-motion tillader øjeblikkelige manuelle skift. Cleanup og et instance-register forhindrer dobbelte callbacks ved geninitialisering.

## Før/efter og optagelser

| Visning | Før, diskrete skift | Efter, kontinuerlig bevægelse |
| --- | --- | --- |
| Mobil | [Screenshot](qa/continuous-carousel-2026-11-11/before/mobile.png) | [Screenshot](qa/continuous-carousel-2026-11-11/verified/continuous-390.png) · [15 sekunders MP4](qa/continuous-carousel-2026-11-11/verified/continuous-mobile-preview.mp4) |
| Desktop | [Screenshot](qa/continuous-carousel-2026-11-11/before/desktop.png) | [Screenshot](qa/continuous-carousel-2026-11-11/verified/continuous-1440.png) · [15 sekunders MP4](qa/continuous-carousel-2026-11-11/verified/continuous-desktop-preview.mp4) |

Førbillederne er bevaret fra den umiddelbart foregående lokale UX-runde. [Fuld mobiloptagelse](qa/continuous-carousel-2026-11-11/verified/continuous-mobile.webm) og [fuld desktopoptagelse](qa/continuous-carousel-2026-11-11/verified/continuous-desktop.webm) viser også interaktionerne. MP4-klippene er udsnit af de faktiske browseroptagelser, ikke genererede animationer. Den færdige desktopvisning er desuden visuelt kontrolleret i native Chrome, inklusive Afspil med fokus på knappen.

## Testresultater

- **Kontinuitet:** 154 målepunkter over 15,5 sekunder pr. visning ved 390/1440 px. Alle faseinkrementer er positive, 0,008325–0,009725 pr. cirka 100 ms; intet ophold mellem kortene.
- **Loop:** Efter manuel placering ved sidste kort kører bevægelsen i normal hastighed over sidste/første i 13,5 sekunder. 167 målepunkter pr. visning. Ingen synlige kort må springe mere end 25 px mellem samples; større genbrugsafstande accepteres kun, når både før- og efter-opacity er under 0,15. Bestået.
- **Interaktion:** Pause/Play med fokus bevaret, fokusindgang, pile, venstre piletast, swipe via pointerdrag på desktop og CDP touch-events på mobil, reduced-motion og offscreen-pause består. Ingen JavaScript-fejl eller vandret overflow. [Detaljerede målinger](qa/continuous-carousel-2026-11-11/verified/results.json).
- **Hover/lifecycle:** Aktiv hover stopper fasen, pointerudgang genoptager, og fem `astro:page-load`-events ændrer ikke hastigheden. [Lifecycle-måling](qa/continuous-carousel-2026-11-11/hover-lifecycle.json).
- **Layout:** 16 sekunders måling ved 390/1440 giver CLS 0 og identisk billedvinduesgeometri før/efter. [Layoutmåling](qa/continuous-carousel-2026-11-11/layout.json).
- **Responsiv/accessibility:** Forsiden er screenshot-/console-/ressource-/overflowkontrolleret ved 320/390/768/1440/1920. Ingen fund; axe på 390/1440 har nul automatiske overtrædelser. [Fem bredder](qa/continuous-carousel-2026-11-11/pages/pages.json).
- **Regression:** Production build, 27-siders statisk link-/asset-/ICS-kontrol og `npm test` består. Smoke-test ved 390/1440 består: tastaturnavigation, FAQ, kontakt-/tilmeldingsdemo, no-JS-galleri med seks billeder, tastaturscroll og retina-kilder. [Smoke](qa/continuous-carousel-2026-11-11/smoke/smoke.json), [build](qa/continuous-carousel-2026-11-11/build.log).

Playwrights officielle FFmpeg blev hentet til den isolerede QA-mappe for optagelse; applikationens dependencies er uændrede. Smoke-testen havde gamle antagelser om synlig mobilnavigation fra før burgermenuen; den er opdateret til eksplicit åbning med klik/tastatur og gentaget til bestået. Produktnavigationen blev ikke ændret for at omgå testen.

`npm run test:carousel` kører den nye test; `test:browser` bruger nu denne i stedet for den gamle diskrete 4,5-sekunders test. Angiv `KINDDESIGN_QA_BASE`, `KINDDESIGN_QA_OUTPUT` og QA-tools efter behov. Default recording kræver Playwrights FFmpeg; den eksisterende isolerede installation genbruges, når den findes.

## Begrænsninger

Mobil er Chrome touch-emulation, ikke en fysisk telefon. Safari, Firefox og skærmlæser er ikke gentestet. Et statisk screenshot beviser ikke kontinuitet; optagelser og tidsserier er det relevante bevægelsesbevis. Der er ingen ændring af billeder, øvrigt sideindhold, Luma, kontaktintegration eller eksterne systemer. Den eksisterende liveversion er uændret i denne opgave.

## Efterfølgende godkendt publicering

Efter brugerens særskilte godkendelse blev `6543826` pushet på `feature/continuous-3d-carousel` og publiceret på det eksisterende [KindDesign-site](https://kinddesign-holdet-ek-2026.netlify.app/). Deploy-ID: `6af47dd1c5d07a7948bde56f`, status ready/live. Ingen merge eller force-push. Production build og statiske tests blev gentaget til bestået før publicering.

Den fulde kontinuerlige carouseltest består også offentligt ved 390/1440: 15,5 sekunders kontinuitet, sidste/første i normal hastighed, fokusbevarende Pause/Play, pile, tastatur, touch/swipe, reduced-motion og offscreen. [Offentlige resultater](qa/continuous-carousel-deploy-2026-11-11/public-carousel.json). Forsiden består ved 320/390/768/1440/1920 uden registrerede JS-/ressourcefejl eller overflow og uden automatiske axe-fund i de scannede bredder. [Offentlig sidematrix](qa/continuous-carousel-deploy-2026-11-11/public-pages.json).
