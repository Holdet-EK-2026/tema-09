# KindDesign – UX/UI-deployment

10. november 2026. Publicering gennemført efter brugerens udtrykkelige godkendelse.

- **URL:** [KindDesign](https://kinddesign-holdet-ek-2026.netlify.app/)
- **Publiceret kodecommit:** `3f2ce0b6366ff732bd76e961be8bf5f1fbdcd90e`, inklusive implementeringscommit `3c46dd6755adfd28c0cd92107c110a73d645bc03`.
- **Netlify-site:** `8cae5019-b5f0-4a43-b9d3-3d33e9363d5e` – eksisterende projekt, intet nyt projekt oprettet.
- **Deploy-ID:** `6af34a2e5ac8ad72cd7e9c25`.
- **Status:** `ready`, production, publiceret 10. november 2026 kl. 16.45 UTC / 17.45 CET.
- [Deployment i Netlify](https://app.netlify.com/sites/8cae5019-b5f0-4a43-b9d3-3d33e9363d5e/deploys/6af34a2e5ac8ad72cd7e9c25).

## Før publicering

Working tree var ren på `feature/ux-ui-final-qa`; begge ønskede commits var til stede. Remote `main` stod på `895b58e`, som er forfader til den verificerede branch. Ændringerne blev pushet atomisk til `main` og `feature/ux-ui-final-qa` uden force-push, merge eller overskrivning af andres arbejde. Ingen urelateret kildekode blev tilføjet. Luma-data, kontaktformularens kode og Netlify-konfiguration er uændrede fra den tidligere version; Supabase og andre eksterne tjenester er ikke ændret.

Astro production build og statiske checks bestod. Carousel- og UX-interaktionstestene bestod lokalt ved 390/768/1440 px. 63 relevante lokale side/bredde-kombinationer bestod ved reference- og mellembredder. Autoplay skiftede to gange i reel browsertid før upload.

Den genererede lokale `dist`-mappe fik uventede kopifiler som `index 2.html`. Årsagen til filernes fremkomst er ikke fastslået. Første upload blev derfor afløst af en ny build i en isoleret `/tmp`-mappe: **104 filer, 27 HTML-sider og ingen kopifiler**. Samtlige normale HTML-, CSS-, JS-, billed- og fontfiler er byteidentiske med den lokalt testede build; ICS har kun et nyt build-tidsstempel, uændret eventindhold. Den rene build bestod den samme statiske link-/assetkontrol før den afsluttende publicering. [Artifact-manifest](qa/ux-ui-deployment-2026-11-10/artifact.json).

Eksisterende Netlify CLI og sitekobling blev genbrugt med `deploy --prod --no-build --site 8cae5019-b5f0-4a43-b9d3-3d33e9363d5e --dir <ren buildmappe>`. Netlifys deploykilde er CLI; `commit_ref` sættes ikke automatisk af denne forbindelse. Kodehashen ovenfor dokumenterer det rene checkout, builden stammer fra, og filhashene er efterprøvet på det offentlige site. Git Continuous Deployment er fortsat ikke koblet til; ingen adgangsrettigheder blev ændret.

## Offentlig QA efter deployment

Playwright/Chrome åbnede den offentlige HTTPS-adresse. Eksisterende tests blev genbrugt i midlertidige udgaver med public-URL som base; ingen produktkode blev ændret for at få dem til at bestå. Resultaterne er fra den sidste rene deployment.

| Bredde | Første automatiske skift | Andet automatiske skift |
| --- | --- | --- |
| 390 px | Indeks 1 efter 4499 ms | Indeks 2 efter 8999 ms |
| 768 px | Indeks 1 efter 4502 ms | Indeks 2 efter 9002 ms |
| 1440 px | Indeks 1 efter 4502 ms | Indeks 2 efter 9002 ms |

Disse skift bruger reel browsertid og ingen carouselklik, tastatur- eller swipe-input. Supplerende kontroller med kontrolleret tid beviser loop, hover-/fokus-/pointerpause, vedvarende pause/play, genoptagelse, reduced-motion, offscreen, cleanup og native Chrome-touch/swipe. Faneskjul er en simuleret visibilitychange-kontrakt som i den oprindelige QA, ikke en fysisk baggrundsfane-test.

| Offentlig kontrol | Resultat |
| --- | --- |
| Autoplay, pause/play, pile, tastatur og mobil swipe | Bestået ved 390/768/1440. Ingen autoplay-CLS. |
| FAQ | Alle tre spørgsmål/svar, ét åbent svar ad gangen, Enter/Space, plus/minus, reduced-motion og statisk no-JS-fallback består. |
| Navigation og hover | Centrale sider, aktiv side, tastatur, synligt fokus og stabile rektangler under hover består ved alle tre bredder. |
| Layout og ressourcer | 21 side/bredde-kombinationer: Forside, Events, Kalender, Om, Ny her, Kontakt og Tokyo-eventdetalje ved alle tre bredder. Ingen JS-/consolefejl, manglende billeder, fejlede lokale ressourcer eller vandret overflow. |
| Tilgængelighed | Nul automatiske axe-fund i de kørte side-, FAQ-, pause- og reduced-motion-kontroller. |
| Fonte | Anvendte DM Sans-/Bricolage-fonte indlæses; en ubrugt fontface kan korrekt stå som unloaded på en side, der kun bruger DM Sans. Begge fontfiler matcher den rene build. |
| Offentlig artifact-integritet | 37 HTML-/CSS-/JS-/font-/ICS-filer matcher den isolerede build byte for byte. Ukendt rute giver egen 404 med HTTP 404, og kopifilruter findes ikke. |
| Ændringer i eksterne tjenester | Ingen Supabase-, Luma-, kontakt- eller andre integrationer ændret. Ingen booking eller kontaktbesked sendt. |

Evidens: [Carousel](qa/ux-ui-deployment-2026-11-10/public-carousel.json), [FAQ/navigation](qa/ux-ui-deployment-2026-11-10/public-interactions.json), [sider/fonte/billeder](qa/ux-ui-deployment-2026-11-10/public-pages.json), [filhashkontrol](qa/ux-ui-deployment-2026-11-10/public-integrity.json). Screenshots og logs ligger i samme mappe.

| Bredde | Forside | Carousel | Åben FAQ |
| --- | --- | --- | --- |
| 390 | [Screenshot](qa/ux-ui-deployment-2026-11-10/forside-390.png) | [Screenshot](qa/ux-ui-deployment-2026-11-10/carousel-390.png) | [Screenshot](qa/ux-ui-deployment-2026-11-10/faq-open-390.png) |
| 768 | [Screenshot](qa/ux-ui-deployment-2026-11-10/forside-768.png) | [Screenshot](qa/ux-ui-deployment-2026-11-10/carousel-768.png) | [Screenshot](qa/ux-ui-deployment-2026-11-10/faq-open-768.png) |
| 1440 | [Screenshot](qa/ux-ui-deployment-2026-11-10/forside-1440.png) | [Screenshot](qa/ux-ui-deployment-2026-11-10/carousel-1440.png) | [Screenshot](qa/ux-ui-deployment-2026-11-10/faq-open-1440.png) |

## Udestående

Ingen ny kritisk regression er observeret. Rollback var ikke nødvendig. Sitet publiceres fortsat manuelt; GitHub→Netlify-automatik er ikke aktiveret. Kontaktens demostatus, manuelt eventkatalog, noindex og de øvrige kendte afgrænsninger fra UX/UI-rapporten er bevaret. Safari, Firefox, fysisk mobilenhed og manuel skærmlæser er ikke testet i denne publiceringsrunde.

Rapporten og de ajourførte dokumentationshenvisninger gemmes i et separat dokumentationscommit efter deployment. Det ændrer ingen applikationsfiler og kræver ingen ny publicering af den samme build.
