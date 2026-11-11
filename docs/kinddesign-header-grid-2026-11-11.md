# KindDesign – fælles desktopheader

11. november 2026. Lokal branch `feature/desktop-header-grid`. Ingen push eller deployment.

Headeren var tidligere bygget som logo plus et højrejusteret femkolonne-nav, hvor CTA'en indgik i linkgruppen. Globale og sidespecifikke regler ændrede højde, vægt, margener og navtranslation. Det kunne ikke give en stabilt centreret linkgruppe.

`Header.astro` har nu tre direkte layoutområder: logo, navigation med fire links og en separat Ny her?-CTA. CSS Grid bruger symmetriske fleksible yderkolonner og en intrinsisk midterkolonne. Linkgruppen ligger derfor i viewportens centrum, uafhængigt af logo-/CTA-bredde. Nav-links bruger Flexbox og ens gap. Der er ingen individuel linkmargin, translate-offset eller fast x-position.

Alle header-/nav-/brandregler er fjernet fra `global.css` og `pages.css`; `navigation.css` ejer layout og states. Desktop har 116 px højde, 90 px logo, 56 px link-/CTA-højde og centrum y=58. Den eksisterende forsideplacering over heroen bevares som en layoutkontekst i den fælles fil; den påvirker ikke headerens geometri. DM Sans, KindDesign-farver og underline/hover/focus bevares. Ved 768 px bruger griddet mindre yderspor/gaps og CTA-padding uden overlap.

`aria-current` beregnes fortsat fra routen. Ved Ny her? er kun CTA'en aktiv i den synlige desktopheader; ved andre sider er kun det relevante link aktivt. Den skjulte mobile navigation beskriver samme aktuelle side, aldrig en anden. Mobilens disclosure-menu er bevaret.

## Målinger og screenshots

25 kontroller: fem sider × 768/1024/1440/1920/2560. For hver bredde er logo-, linkgruppe- og CTA-rektangler identiske på alle fem sider. Linkgruppens centrum afviger mindre end 0,1 px fra viewportens centrum. Alle områder har vertikalt centrum y=58. Ingen overlap, vandret overflow eller registrerede JavaScript-fejl.

Koordinaterne nedenfor er faktiske browserrektangler i CSS-px, angivet som x/y. [Alle bredder, dimensioner, states og assertions](qa/header-grid-2026-11-11/measurements.json). De ti efter-screenshots er gennemset visuelt.

| Bredde | Side | Logo x/y | Linkgruppe x/y | CTA x/y | Screenshot |
| --- | --- | --- | --- | --- | --- |
| 1440 | Forside | 64.80 / 13.00 | 488.88 / 30.00 | 1210.20 / 30.00 | [Åbn](qa/header-grid-2026-11-11/forside-1440.png) |
| 1440 | events | 64.80 / 13.00 | 488.88 / 30.00 | 1210.20 / 30.00 | [Åbn](qa/header-grid-2026-11-11/_events_-1440.png) |
| 1440 | om-kinddesign | 64.80 / 13.00 | 488.88 / 30.00 | 1210.20 / 30.00 | [Åbn](qa/header-grid-2026-11-11/_om-kinddesign_-1440.png) |
| 1440 | kontakt | 64.80 / 13.00 | 488.88 / 30.00 | 1210.20 / 30.00 | [Åbn](qa/header-grid-2026-11-11/_kontakt_-1440.png) |
| 1440 | ny-her | 64.80 / 13.00 | 488.88 / 30.00 | 1210.20 / 30.00 | [Åbn](qa/header-grid-2026-11-11/_ny-her_-1440.png) |
| 1920 | Forside | 70.00 / 13.00 | 721.66 / 30.00 | 1685.00 / 30.00 | [Åbn](qa/header-grid-2026-11-11/forside-1920.png) |
| 1920 | events | 70.00 / 13.00 | 721.66 / 30.00 | 1685.00 / 30.00 | [Åbn](qa/header-grid-2026-11-11/_events_-1920.png) |
| 1920 | om-kinddesign | 70.00 / 13.00 | 721.66 / 30.00 | 1685.00 / 30.00 | [Åbn](qa/header-grid-2026-11-11/_om-kinddesign_-1920.png) |
| 1920 | kontakt | 70.00 / 13.00 | 721.66 / 30.00 | 1685.00 / 30.00 | [Åbn](qa/header-grid-2026-11-11/_kontakt_-1920.png) |
| 1920 | ny-her | 70.00 / 13.00 | 721.66 / 30.00 | 1685.00 / 30.00 | [Åbn](qa/header-grid-2026-11-11/_ny-her_-1920.png) |

## Verificering

Production build og `npm test` består med 27 statiske HTML-sider, lokale links, assets, eventdata og ICS. Playwright-regression ved 390/768/1440 består: headernavigation med tastatur, aktiv state, hover uden geometrisk ændring og synligt fokus. FAQ, kontaktens ærlige demo og no-JS-FAQ består fortsat; åbne FAQ-tilstande har nul automatiske axe-fund. [Interaktioner](qa/header-grid-2026-11-11/interactions/ux-interactions.json).

`header-grid.cjs` kan gentage målinger og screenshots. Den tidligere regressionstest er opdateret til at finde aktuelt synligt headerlink, fordi CTA'en nu med vilje ligger uden for navgruppen. Der er ikke ændret testforventninger til geometri for at skjule fejl: den nye test kræver ens koordinater på alle sider og reel centrering ved alle fem bredder.

Ingen nye dependencies, fotos eller fonte. Denne opgave omfatter desktopnavigation; der er ikke gentaget en fuld carousel-, Safari- eller skærmlæseraudit.

## Efterfølgende godkendt deployment

Efter særskilt godkendelse er `941933b` pushet på `feature/desktop-header-grid` og publiceret på det eksisterende [KindDesign-site](https://kinddesign-holdet-ek-2026.netlify.app/). Deploy-ID `6af480bbce1a3201a3e13d66`: ready/live. Ingen merge eller force-push. Production build og statiske tests er gentaget før publicering.

Den offentlige version består samme 25 placeringskontroller: identiske rektangler på de fem sider ved hver bredde, centreret linkgruppe, fælles vertikalt centrum, præcis ét aktuelt synligt link og ingen overlap, overflow eller registrerede JavaScript-fejl. [Offentlige målinger og 10 screenshots](qa/header-grid-2026-11-11/public/measurements.json).
