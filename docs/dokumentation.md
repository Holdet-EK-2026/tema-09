# KindDesign – teknisk dokumentation

Opdateret 9. november 2026. Den lokale implementering omfatter forside, carousel, undersider og Figma-demoflows. [Samlet rapport](fase-2-6-rapport.md) beskriver verifikation, afgrænsninger og commits. Den tidligere dokumentation er bevaret i [fase 1-arkivet](arkiv/dokumentation-fase-1.md); [fase 1-rapporten](fase-1-rapport.md) er uændret.

## Teknologi og struktur

Astro 7.4.8 genererer 19 statiske HTML-sider inklusive 404. HTML, CSS og Vanilla JavaScript er applikationens teknologier; Astro er eneste direkte npm-dependency. Ingen React, Tailwind, egen TypeScript, serverfunktioner eller database er nødvendige for de dokumenterede demoflows. Node skal være mindst 22.23.4; `.nvmrc`, `engines` og Netlify bruger denne version.

`BaseLayout.astro` indeholder dokument, dansk sprog, metadata, fontpreloads og skip-link. `InnerLayout.astro` genbruger Header/Footer og indlæser global CSS før underside-CSS. Rækkefølgen er vigtig: generelle resets må ikke overskrive sidernes spacing. Forsiden henter ikke underside-CSS. `PageHero` og `EventCard` genbruges. `src/data/events.js` er den fælles kilde til de fire Figma-eksempel-events; Astro bygger detail- og demoruter med `getStaticPaths()`.

Farverne er fortsat salvie #A5B39B, sand #E8DCC6, bordeaux #722F37, lyseblå #C0E7F6 og tekst #280E11. Grid fordeler kolonner, Flexbox stabler indhold, og media queries vælger mobilkompositionen ved 600 px. Mellembredder må vokse efter indholdet. Der er ingen identificeret 768 px-Figma-frame; tablet følger de eksisterende responsive principper.

## Typografi og billeder

Bricolage Grotesque og DM Sans hostes lokalt. Fase 1-referencecommit `04aef1b` fastlagde vægt 700/400, normal bredde, automatisk optisk størrelse, nul letter-spacing og `font-synthesis: none`. Disse egenskaber er bevaret. Undersidernes overskrifter, inklusive V2-heroer, bruger DM Sans Bold efter deres egne Figma-frames. Fonte er komprimeret fra de samme TTF-filer til WOFF2 uden ændring af glyffer eller variable akser. Originaler ligger i `docs/source-fonts`, og OFL-licenser er bevaret. En kontrolleret mobiltest af overskrift og brødtekst gav identiske pixels før/efter komprimering.

Autentiske Figma-fotos og perspektivkort er bevaret; ingen AI- eller stockerstatninger er anvendt. Originaleksporter ligger i `docs/source-assets`. WebP bruger kvalitet 92; `srcset` giver mindre varianter af samme foto og større hero/logo til retinaskærme. Hero har høj henteprioritet, øvrige fotos lazy loading. Dekorative fotos har tom alt-tekst, meningsbærende fotos beskrivende alt-tekst. Founderportrætter afventer fortsat tilladelse som i Figma.

## JavaScript og dataflow

**Carousel:** Et aktivt indeks og modulo bestemmer næste kort. Desktop bruger målte Figma-positioner, mobil native horisontal scroll med en skjult overgangskopi. Pile, piletaster og swipe giver manuel navigation. Automatisk skift sker hvert sjette sekund, når galleriet er synligt og ikke er pauset af bruger, fokus, hover, berøring, skjult fane eller reduced-motion. Status annonceres ved manuelle skift. Uden JavaScript bevares det statiske galleri, og kontrollerne er deaktiveret.

**Eventfiltre:** Kategoriknapper opdaterer kortenes `hidden`, `aria-pressed` og URL-parametret `type`. `popstate` genskaber filteret ved tilbage/frem. Uden JavaScript vises alle events. Novemberkalenderen er statisk og linker til de samme detailruter.

**Tilmelding:** Figma-reactions fører til interne demoer. Der er ikke fundet faktiske Luma-eventadresser. Uden konfiguration går CTA til lokal tilmeldingsdemo med en tydelig bekræftelse af, at brugeren IKKE er tilmeldt. Kalenderdemoen tilføjer intet til en rigtig kalender. Fire valgfrie `PUBLIC_LUMA_*_URL` kan ved build pege på godkendte events. Koden accepterer kun HTTPS med eventsti hos lu.ma/luma.com og uden URL-credentials; dette validerer format og domæne, ikke eventets autenticitet. Ingen booking er foretaget.

**Kontakt:** Klik vælger emne, og submit validerer navn, e-mail og besked. Fejloverblik får fokus, felter forbindes med fejl via ARIA, og rettelser opdateres efter første validering. Gyldige felter viser en lokal demobekræftelse med fokusretur/nulstilling. Ingen fetch, POST, database eller localStorage anvendes. Uden JavaScript er submit deaktiveret, så persondata heller ikke sendes som GET-parametre. Kontakt er fortsat »PROTOTYPE · Intet sendes«.

**Medlemskort:** En native dialog forklarer desktopkonceptet. Der er ingen konto, login eller medlemsregistrering. Links og native knapper bevarer tastaturbetjening, Escape og fokusretur.

## Backend og hosting

Supabase er vurderet og fravalgt efter den seneste instruktion om kun at implementere dokumenterede, relevante backendfunktioner. Ingen redaktørrolle, rigtig tilmelding eller medlemskonto er besluttet, og kontaktdata må ikke sendes. Praktisk SQL/CRUD/RLS er derfor ikke gennemført; se [vurderingen](fase-4-supabase-vurdering.md).

`netlify.toml` kører `npm run build && npm test`, publicerer `dist` og konfigurerer preview-/branch-builds, cache for hash-assets, nosniff og referrer-policy. Der er ingen SPA-rewrite. Den officielle CLI er testet med lokal `build --offline --context deploy-preview`. Dette opretter ikke et hostet preview. Der er ingen push, merge, repository-forbindelse eller deployment. Se [fase 5](fase-5-netlify.md).

Siderne har bevidst `noindex, nofollow`, så en prototype ikke indekseres. Titler, beskrivelser og OpenGraph-tekst er tilføjet. Canonical-domæne, sitemap og indeksering afventer et besluttet produktionsdomæne; ingen URL er opfundet. `.env.example` indeholder kun tomme offentlige Luma-adresser. Secrets skal aldrig have `PUBLIC_`-præfiks.

## Kørsel og tests

```sh
npm ci
npm run build
npm test
npm run preview -- --host 127.0.0.1 --port 4321
```

Npm-scripts kalder Astro via Node direkte for at understøtte kolon i projektets overordnede mappe. `npm test` kræver først en build og kontrollerer alle HTML-filer, interne links, ankre og assets samt sprog, h1 og titler.

Browser- og Lighthouse-værktøjer holdes uden for applikationens dependencies. QA bruger Playwright 1.65.0, @axe-core/playwright 4.14.0, Lighthouse 13.6.0, Sharp og installeret Google Chrome. Standardplacering er `/tmp/kinddesign-tools`; `KINDDESIGN_QA_TOOLS` kan angive en anden mappe med `node_modules`. Installer disse værktøjer i en separat QA-mappe med npm, og start preview på port 4321 før:

```sh
npm run test:browser
node scripts/qa/smoke.cjs
node scripts/qa/luma-config.cjs
npm run test:lighthouse
node scripts/qa/visual.cjs
```

Visuel sammenligning bruger de bevarede Figma-referencer i `docs/qa/fase-3/references`. Screenshot- og auditresultater ligger i `docs/qa/fase-6`. Lighthouse er en enkelt lokal laboratoriemåling pr. rute/profil, ikke feltdata eller en garanti for alle enheder. Automatiske axe-checks erstatter ikke manuel skærmlæser- og browsergennemgang. Safari/Firefox og alle zoomniveauer er ikke testet.

## Kilder og rapporter

- [Figma – aktiv side](https://www.figma.com/design/upaKrrIg3bRBgo4Md8s12F/Prototype---Tema-9?node-id=753-846)
- [Fase 2: carousel](fase-2-rapport.md)
- [Fase 3: sider, frames og visuel QA](fase-3-rapport.md)
- [Fase 4: Supabasevurdering](fase-4-supabase-vurdering.md)
- [Fase 5: Netlify](fase-5-netlify.md)
- [Samlet fase 2–6-rapport](fase-2-6-rapport.md)
- [Google Fonts: Bricolage Grotesque](https://github.com/google/fonts/tree/main/ofl/bricolagegrotesque) og [DM Sans](https://github.com/google/fonts/tree/main/ofl/dmsans)

## Hostingbegreber til gruppens gennemgang

En build omsætter Astro-komponenter til HTML, CSS, JavaScript og lokale assets i `dist`. Hosting gør disse filer tilgængelige fra en webserver. Continuous Deployment betyder, at en forbundet repository-branch udløser en ny build ved en ændring. Et Deploy Preview viser en foreslået ændring på en særskilt URL før produktion. Konfigurationen til disse builds er klar, men den eksterne GitHub-/Netlify-forbindelse er ikke oprettet. Git-commits er lokale versionspunkter; et commit er hverken et push, et review, et merge eller en publicering.
