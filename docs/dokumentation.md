# KindDesign – teknisk dokumentation

Opdateret 10. november 2026. Den lokale implementering omfatter forside, carousel, undersider og Figma-demoflows. [Samlet rapport](fase-2-6-rapport.md) beskriver verifikation, afgrænsninger og commits. Den tidligere dokumentation er bevaret i [fase 1-arkivet](arkiv/dokumentation-fase-1.md); [fase 1-rapporten](fase-1-rapport.md) er uændret.

## Teknologi og struktur

Astro 7.4.8 genererer 27 statiske HTML-sider inklusive 404 og en kalenderfil til det kommende officielle event. HTML, CSS og Vanilla JavaScript er applikationens teknologier; Astro er eneste direkte npm-dependency. Ingen React, Tailwind, egen TypeScript, serverfunktioner eller database er nødvendige for de dokumenterede demoflows. Node skal være mindst 22.23.4; `.nvmrc`, `engines` og Netlify bruger denne version.

`BaseLayout.astro` indeholder dokument, dansk sprog, metadata, fontpreloads og skip-link. `InnerLayout.astro` genbruger Header/Footer og indlæser global CSS før underside-CSS. Rækkefølgen er vigtig: generelle resets må ikke overskrive sidernes spacing. Forsiden henter ikke underside-CSS. `PageHero` og `EventCard` genbruges. `src/data/events.js` samler otte verificerede Luma-events fra `luma-events.js` og fire tydeligt adskilte Figma-eksempel-events; Astro bygger detail- og demoruter med `getStaticPaths()`.

Farverne er fortsat salvie #A5B39B, sand #E8DCC6, bordeaux #722F37, lyseblå #C0E7F6 og tekst #280E11. Grid fordeler kolonner, Flexbox stabler indhold, og media queries vælger mobilkompositionen ved 600 px. Mellembredder må vokse efter indholdet. Der er ingen identificeret 768 px-Figma-frame; tablet følger de eksisterende responsive principper.

## Typografi og billeder

Bricolage Grotesque og DM Sans hostes lokalt. Fase 1-referencecommit `04aef1b` fastlagde vægt 700/400, normal bredde, automatisk optisk størrelse, nul letter-spacing og `font-synthesis: none`. Disse egenskaber er bevaret. V2-sidernes overskrifter og heroer bruger DM Sans Bold; forside og legacy-sider bruger Bricolage Grotesque efter deres respektive Figma-frames. Fonte er komprimeret fra de samme TTF-filer til WOFF2 uden ændring af glyffer eller variable akser. Originaler ligger i `docs/source-fonts`, og OFL-licenser er bevaret. En kontrolleret mobiltest af overskrift og brødtekst gav identiske pixels før/efter komprimering.

Autentiske Figma-fotos og perspektivkort er bevaret; ingen AI- eller stockerstatninger er anvendt. Originaleksporter ligger i `docs/source-assets`. WebP bruger kvalitet 92; `srcset` giver mindre varianter af samme foto og større hero/logo til retinaskærme. Hero har høj henteprioritet, øvrige fotos lazy loading. Dekorative fotos har tom alt-tekst, meningsbærende fotos beskrivende alt-tekst. Founderportrætter afventer fortsat tilladelse som i Figma.

## JavaScript og dataflow

**Carousel:** Den eksisterende komponent er videreudviklet til ét fælles galleri på alle bredder. Seks uforvrængede, autentiske KindDesign-fotos ligger i et array. Modulo giver cirkulær afstand til det aktive kort; CSS `translate3d`, `rotateY` og scale skaber dybde. Glasrammer bruger sand, fine borders, moderate skygger og 10 px backdrop-blur. Kun transform og opacity animeres, i 800 ms med cubic-bezier(.22,1,.36,1). Det centrale kort er skarpt og fuldt synligt. Et skjult yderkort repositioneres uden en synlig passage gennem centrum. Kun aktivt kort viser billedtekst og er med i skærmlæserens billedindhold; indikatorer og manuel status annoncerer skift uden fokusflytning.

Autoplay bruger en timeout på 4,5 sekunder, når mindst 25 % af galleriet er synligt. Hover, fokus, berøring/drag, skjult dokument og eksplicit pause stopper timeren. Efter manuel navigation ventes mindst otte sekunder og indtil hover/fokus er ophørt. Pause/play ændrer brugerens vedvarende valg. Reduced-motion slår autoplay og CSS-overgange fra, også ved systemændring mens siden er åben. Pile, indikatorer, piletaster, Home/End og swipe bruger samme aktive indeks. Pointercapture holder drag samlet, og et swipe undertrykker efterfølgende klik. Kortene er communityfotos, ikke påståede billeder fra bestemte Luma-events; derfor har de ikke tilfældige eventlinks.

Uden JavaScript bevares et horisontalt fotogalleri med native scroll og deaktiverede kontroller. Billedvarianter på 600/1600 px tager højde for beskæring og pixeltæthed. Store varianter aktiveres tæt på viewporten; native noscript-billeder bevarer galleriet uden JavaScript. Eventcovers har 450/600/højst 1200 px-varianter uden opskalering af små originaler. Der er ingen animationspakke eller nyt UI-framework.

**Eventfiltre:** Type og status er separate filtre. Knapper opdaterer kortenes `hidden`, `aria-pressed`, et live-resultatantal og URL-parametrene `type`/`status`. Nul resultater giver en synlig tomtilstand og nulstilling. Reload og `popstate` genskaber valget. Uden JavaScript vises hele det officielle katalog. Figma-eksempler er samlet under en separat, forklarende details-kontrol og blandes ikke med bookbare events.

**Officielle events og Luma:** `luma-events.js` er et manuelt kontrolleret katalog, ikke en crawler. Det indeholder titel, kort dansk opsummering, UTC-start/-slut, IANA-tidszone, offentligt sted, officiel coverkilde, direkte eventlink og verificeringsdato. Den 9. november 2026 blev ét kommende og syv tidligere events verificeret via profilens offentlige eventlinks. Tokyo-eventet den 13. november starter 09.30 UTC, svarende til 18.30 i Asia/Tokyo. Tider og datoer vises i eventets lokale tidszone. Eventtype er en redaktionel klassifikation af formatet; den er ikke præsenteret som Lumas API-kategorier.

Brugerrejsen er Forside → Events → egne eventdetaljer → direkte tilmelding hos Luma. Ingen embed overtager sidelayoutet. Afholdte events har arkivlink og ingen tilmeldings- eller kalenderdownloadknap. Status beregnes ved build og sikres igen i klienten ved indlæsning og hvert minut, så en åben gammel side ikke beholder tilmeldings-CTA efter sluttid. Eksisterende `PUBLIC_LUMA_*`-overrides er fjernet, så en demo ikke kan omdøbes til en uverificeret rigtig booking. Kontakt, medlemskort og de fire gamle tilmeldingsruter er fortsat udtrykkelige demoer.

Lumas offentlige kilder er ikke altid konsistente: Real-talk har forskelligt årstal i kalenderdata og beskrivelse; Berlin har forskellig sluttid. Begge forhold er synligt markeret på detaljesiderne. Der hævdes ingen fuldstændig automatisk synkronisering eller fejlfrit eksternt kildemateriale.

**Kalender:** Måneder bygges ud fra katalogets lokale datoer samt den aktuelle måned. En native select og URL-parametret `month` vælger måned; seks uger beregnes korrekt fra mandag til søndag. Uden JavaScript vises den aktuelle måned. Det kommende event kan downloades som en rigtig RFC 5545-kalenderfil med UTC-tider, escaped tekst, CRLF og UTF-8-linjefoldning. Download er ikke en booking og tilføjer intet automatisk til en ekstern konto.

**Nedtælling:** Forsiden beregner faktisk tid til det verificerede kommende events UTC-start og viser Tokyo som sted. Værdier opdateres uden layoutanimation eller live-annoncering. Når start/slut passeres, vises en passende status. Ved en build uden kommende events vises et link til oversigten i stedet for et opdigtet countdown-event.

**Kontakt:** Klik vælger emne, og submit validerer navn, e-mail og besked. Fejloverblik får fokus, felter forbindes med fejl via ARIA, og rettelser opdateres efter første validering. Gyldige felter viser en lokal demobekræftelse med fokusretur/nulstilling. Ingen fetch, POST, database eller localStorage anvendes. Uden JavaScript er submit deaktiveret, så persondata heller ikke sendes som GET-parametre. Kontakt er fortsat »PROTOTYPE · Intet sendes«.

**Medlemskort:** En native dialog forklarer desktopkonceptet. Der er ingen konto, login eller medlemsregistrering. Links og native knapper bevarer tastaturbetjening, Escape og fokusretur.

## Backend og hosting

Den oprindelige opgave kræver praktisk Supabase/SQL/CRUD. Det er stadig et udestående læringsmål. En minimal relevant løsning er redaktøradministration af det nu dokumenterede eventkatalog. Connectorens read-only projektliste identificerede intet sikkert KindDesign-testprojekt; det tilgængelige generiske projekt er inaktivt og er ikke valgt, gendannet eller ændret. En identificeret testdatabase og afklaret redaktørautorisation mangler derfor, så en faktisk databaseintegration er blokeret. Ingen credentials er hentet. Ingen Supabase Auth, medlemsprofiler eller usikker offentlig skrivning er tilføjet. Se [den fornyede vurdering](fase-4-supabase-vurdering.md).

Luma har en officiel API, men den kræver Luma Plus og en nøgle til den enkelte kalender. Der er ingen sådan nøgle eller dokumenteret API-adgang til rådighed. Den aktuelle integration bruger derfor direkte verificerede links og lokal dataadministration. API-nøgler må aldrig lægges i browseren. Se [Lumas officielle adgangskrav](https://docs.luma.com/reference/getting-started-with-your-api).

`netlify.toml` kører `npm run build && npm test`, publicerer `dist` og konfigurerer preview-/branch-builds, cache for hash-assets, nosniff og referrer-policy. Der er ingen SPA-rewrite. Den officielle CLI er testet med lokal `build --offline --context deploy-preview`. Dette opretter ikke et hostet preview. Der er ingen push, merge, repository-forbindelse eller deployment. Se [fase 5](fase-5-netlify.md).

Siderne har bevidst `noindex, nofollow`, så en prototype ikke indekseres. Titler, beskrivelser og OpenGraph-tekst er tilføjet. Canonical-domæne, sitemap og indeksering afventer et besluttet produktionsdomæne; ingen URL er opfundet. `.env.example` forklarer, at det lokale katalog ikke kræver credentials. Secrets skal aldrig have `PUBLIC_`-præfiks.

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

Visuel sammenligning bruger aktuelle Figma-kontekster og de bevarede referencer i `docs/qa/fase-3/references`. Den nye carousel sammenholdes med den nu vedhæftede video. Ny evidens ligger i `docs/qa/final-implementation`; fase 1–6-resultater er bevaret som historik. Lighthouse er en enkelt lokal laboratoriemåling pr. rute/profil, ikke feltdata eller en garanti for alle enheder. Automatiske axe-checks erstatter ikke manuel skærmlæser- og browsergennemgang. Safari/Firefox og alle zoomniveauer er ikke testet.

## Kilder og rapporter

- [Figma – aktiv side](https://www.figma.com/design/upaKrrIg3bRBgo4Md8s12F/Prototype---Tema-9?node-id=753-846)
- [Fase 2: carousel](fase-2-rapport.md)
- [Fase 3: sider, frames og visuel QA](fase-3-rapport.md)
- [Fase 4: Supabasevurdering](fase-4-supabase-vurdering.md)
- [Fase 5: Netlify](fase-5-netlify.md)
- [Samlet fase 2–6-rapport](fase-2-6-rapport.md)
- [Ny afsluttende carousel-/Luma-rapport](final-implementation-rapport.md)
- [Google Fonts: Bricolage Grotesque](https://github.com/google/fonts/tree/main/ofl/bricolagegrotesque) og [DM Sans](https://github.com/google/fonts/tree/main/ofl/dmsans)

## Hostingbegreber til gruppens gennemgang

En build omsætter Astro-komponenter til HTML, CSS, JavaScript og lokale assets i `dist`. Hosting gør disse filer tilgængelige fra en webserver. Continuous Deployment betyder, at en forbundet repository-branch udløser en ny build ved en ændring. Et Deploy Preview viser en foreslået ændring på en særskilt URL før produktion. Konfigurationen til disse builds er klar, men den eksterne GitHub-/Netlify-forbindelse er ikke oprettet. Git-commits er lokale versionspunkter; et commit er hverken et push, et review, et merge eller en publicering.
