# KindDesign – teknisk dokumentation

Dato: 9. november 2026. Denne fil dokumenterer udført arbejde i fase 1 og adskiller det fra senere planer. Resultater og billeder findes i [fase-1-rapport.md](../fase-1-rapport.md).

## Teknologivalg

**Astro 7.4.8** samler genbrugelige komponenter og bygger HTML-filer. Forsiden kræver ingen server ved visning. Semantisk **HTML** beskriver navigation, overskrifter og sektioner. **CSS** styrer farver, typografi, Grid, Flexbox og responsivitet. **Vanilla JavaScript** håndterer previewets navigation med browserens DOM-API. Kun Astro er direkte npm-dependency i applikationen. React, Vue, Svelte, Tailwind og egen TypeScript er fravalgt i overensstemmelse med opgaven. Astro kan selv generere typer i sin ignorerede `.astro`-mappe; det er ikke selvskrevet applikationskode.

**Supabase** er planlagt som læringsmål i fase 4, hvor et begrundet indholdsmodul kan demonstrere SQL, relationer, CRUD, API-kald og RLS. Der er endnu ikke valgt datamodel, oprettet tabeller eller nøgler eller implementeret databasekode. **Netlify** er planlagt som hosting i fase 5. **GitHub** er det fælles repository til versionshistorik og senere review gennem branches og pull requests. Ingen eksterne tjenester er oprettet i denne fase.

Node 22.23.4 er minimum for den installerede Astro-version. Den eksisterende system-Node var 22.20.0. Build og QA blev derfor udført med en isoleret Node 22.23.4 i `/tmp/kinddesign-tools`; systemets installation blev ikke ændret. Projektets `.nvmrc`, `engines` og Netlify-konfiguration angiver den krævede version.

## Fra Figma til kode

Kilderne er desktop `753:847` og mobil `757:2326` med indhold i `757:2327`, i fil `upaKrrIg3bRBgo4Md8s12F`. Frames markeret ARKIV er ikke anvendt. Designkontekst, laggeometri og tekstegenskaber blev aflæst gennem Figma-værktøjerne. Figma blev ikke ændret.

De fem godkendte farver er CSS-variabler i `:root`: salvie `#A5B39B`, sand `#E8DCC6`, bordeaux `#722F37`, lyseblå `#C0E7F6` og tekst `#280E11`. Overskrifter bruger Bricolage Grotesque Bold, brødtekst DM Sans Regular og navigation på desktop DM Sans Bold. Variable fonte hostes lokalt med automatisk optisk størrelse, normal breddeakse 100 og CSS-vægt 700/400. Den afsluttende QA viste, at fastlåst `opsz: 14` fra Figma-metadata ikke matcher referenceeksportens faktiske glyffer. Kontrollerede browserforsøg med samme fonte og vægte viste et markant bedre match med optisk størrelse svarende til fontstørrelsen. Dette er en empirisk renderingkonklusion, ikke bevis for Figma-rendererens interne funktion. Fontfilerne kommer fra Google Fonts' officielle repository, med OFL-licenser vedlagt.

Astro-komponenter skaber en forståelig opdeling uden et JavaScript-framework. Grid styrer desktopnavigation og community-kort, Flexbox styrer lodrette indholdsstakke. Heroens billede, eksempel-nedtælling og desktopgalleriets forskudte kort har positionsstyret komposition, som kræves af designet. Billederne er enkeltassets fra Figma; hele frames er ikke anvendt som hjemmesidens indhold.

Ved 390 px skifter siden til den selvstændige mobilkomposition: anden hero, navigation i to rækker, fuldbreddeknap, fire kvadratiske gallerifotos og salviegrøn community. Media query ved 600 px adskiller mobilkompositionen fra de større bredder. Ved 768 px bruges fleksible kolonner, 32 px sidemargen og mindre tekst. Tablet har ingen identificeret godkendt frame og er et dokumenteret layoutvalg. Ved større tekst eller andre bredder må sektioner vokse med indholdet.

Figma afrunder tekstfelternes mobilhøjder til hele pixels. Aflæste linjehøjder er derfor omsat til eksempelvis 69 px i herooverskriften, 36 px i tagline og 25 px i mobilbrødtekst. Det giver samme sektionstoppe og højder som Figma ved 390 px, uden faste højder på hele tekstsektioner.

## Billeder

Figma-assets blev hentet lokalt og originalerne bevaret i `docs/source-assets`. WebP-filerne i `public/images` bruger kvalitet 92; fotos med stor originalopløsning og logoet er nedskaleret til deres brug. Alpha bevares på galleriets perspektivkort. Samlet billedstørrelse faldt fra 33.854.764 til 3.564.734 bytes, cirka 89,5 %. Dette er filstørrelsen for samtlige assets, ikke et målt netværksbudget pr. viewport. Se `qa/asset-optimization.json`.

Hero har høj henteprioritet, øvrige fotos lazy loading og alt-tekster. `<picture>` vælger korrekt hero til mobil. Logo og community-foto genbruges. Opgaven og Figma er kilde til fotografierne; fotografrettigheder er ikke uafhængigt dokumenteret i det tilgængelige materiale. Der er ikke anvendt AI-billeder eller stockerstatninger.

## JavaScript: navigation til kommende sider

Formål: Gør fase 1-previewet forståeligt, mens de øvrige sider endnu ikke er bygget.

1. `querySelectorAll('[data-future-page]')` finder links til senere sider.
2. `querySelector('#phase-dialog')` finder HTML-dialogen.
3. `forEach()` tilføjer en `click`-event listener til hvert link.
4. `preventDefault()` stopper den almindelige navigation ved klik.
5. `showModal()` åbner dialogen. En HTML-formular med `method="dialog"` lukker den; Escape virker gennem browseren.

Dataflowet er klik → event listener → dialog. Der sendes ingen data til en server. Browserens native dialog håndterer fokus inde i dialogen og returnerer fokus ved lukning. Testen aktiverede hero-CTA, kontrollerede åben dialog, trykkede Escape og kontrollerede tilbageført fokus ved alle tre bredder. Linkenes fremtidige adresser er bevaret, men kontekstmenuens »åbn i ny fane« går til en endnu ikke bygget rute; dette preview er kun forsiden.

Der er ingen automatisk carousel, timer, touch/swipe-kode eller Supabase-kald. Vandret scroll bruger browserens egen funktion; galleriet kan fokuseres med tastatur. Pilene er dekorative spans, ikke knapper der foregiver funktionalitet.

## Build, hosting og versionsstyring

`npm run build` genererer den statiske side i `dist`. `npm run dev` er til udvikling, og `npm run preview` viser en bygget udgave lokalt. `netlify.toml` klargør `npm run build`, `dist` og Node-version. Der er ikke brug for en adapter til den nuværende statiske forside.

I fase 5 skal gruppen forbinde GitHub med Netlify, kontrollere en Deploy Preview og siden beslutte merge/publicering. Continuous Deployment betyder, at en kodeændring på en forbundet branch udløser en ny build. Miljøvariabler oprettes først, når en funktion kræver dem; ingen nøgler er nødvendige i fase 1.

Repositoryet blev undersøgt med GitHub-connector og klonet; det var tomt og uden eksisterende commits. En lokal orphan-featurebranch blev derfor oprettet. Der er endnu ingen `main`-base at oprette en normal pull request mod. Remote er ikke ændret. Gruppen kan senere vælge den første basebranch og workflow.

## Verifikation og begrænsninger

Builden bestod. Chrome-screenshots ved 390, 768 og 1440 px findes i `qa`. Ingen dokument-overflow eller JavaScript-fejl blev registreret. Axe fandt ingen automatiske WCAG A/AA-fund i det testede, lukkede dialogstadium. Dette er ikke bevis for fuld tilgængelighed: skærmlæser, alle zoomniveauer og komplet manuel WCAG-gennemgang er ikke udført.

Afsluttende fuldsideoverlay og difference ligger i `qa/final` ved 1440×3088 og 390×2792. Mobilens indhold blev klonet midlertidigt til samme Figma-page uden den klippende parent, eksporteret og slettet igen. Originalens design og geometri blev ikke ændret. Alle sektioner under folden er nu direkte sammenlignet. Figma havde stadig kun aktive forsideframes ved 390 og 1440 px; 768 px er kontrolleret responsivt, uden en påstået Figma-reference ved den bredde.

Fontfamilier, CSS-vægt 400/700, normal bredde, nul letter-spacing og de eksisterende Figma-aflæste linjehøjder er bevaret. Den fastlåste optiske akse er erstattet af `font-optical-sizing: auto`, og `font-synthesis: none` forhindrer syntetiske fonte. Der er ikke brugt skaleret tekst eller vilkårlig tracking som kompensation. De store bredde- og ombrydningsforskelle er fjernet. Mindre forskelle i tekstbaseline/antialiasing og komprimerede fotopixels består; se den aktuelle rapport. Figma-eksport og Chrome er stadig forskellige renderere, så bitidentitet eller et verificeret fælles renderingmiljø hævdes ikke.

Afsluttende tests kontrollerede alle synlige links til kommende sider (11 på mobil, 12 på tablet/desktop) med Enter, dialoglukning med knap/Enter og Escape samt fokusretur. Skip-link, synlig navigation, mobilens tabrækkefølge, logonavigation, vandret galleriscroll og reduced-motion blev kontrolleret. Axe bestod både på forsiden og med åben dialog. Chrome kan under Tab flytte fokus til browserens egen grænseflade; testen accepterer dette, men ikke fokus på bagvedliggende sideelementer. To separate navigationsblokke, hvor CSS kun viser én, sikrer korrekt DOM-rækkefølge på begge layouts.

## Kort kodegennemgang til gruppen

**Hvad er lavet?** `index.astro` samler Header, Hero, Carousel, Community og Footer inde i BaseLayout. Carousel er i fase 1 et statisk galleri. Alle billeder og fonte indlæses lokalt.

**Hvordan virker det?** Astro bygger komponenterne til HTML. CSS Grid fordeler kolonner; Flexbox stabler indhold; media queries vælger det responsive layout. HTML-links identificeres via en data-attribut. JavaScript finder disse DOM-elementer og reagerer med en event listener. Den native dialog forklarer de kommende sider.

**Hvorfor denne løsning?** Der er ét lille script og én direkte dependency. Komponentenhederne følger sidens sektioner, så gruppen kan fordele arbejdet uden state management eller et UI-framework. Almindeligt scroll og native dialog begrænser specialkode.

**Hvad skal I kunne forklare?** Semantisk HTML, heading-hierarki, Astro-komponenter og layouts, CSS-variabler, Grid, Flexbox, media queries, billedbeskæring med `object-fit`, DOM, `querySelectorAll`, `forEach`, events og `preventDefault`, tastaturfokus samt forskellen på lokal udvikling, build og hosting. API, CRUD, SQL, RLS og deployment er senere læringsmål, ikke allerede implementerede resultater.

## Kilder

- [Aktiv Figma-desktop](https://www.figma.com/design/upaKrrIg3bRBgo4Md8s12F/Prototype---Tema-9?node-id=753-847)
- [Aktiv Figma-mobil](https://www.figma.com/design/upaKrrIg3bRBgo4Md8s12F/Prototype---Tema-9?node-id=757-2326)
- [Astro-installation og krav](https://docs.astro.build/en/install-and-setup/)
- [Google Fonts: Bricolage Grotesque](https://github.com/google/fonts/tree/main/ofl/bricolagegrotesque)
- [Google Fonts: DM Sans](https://github.com/google/fonts/tree/main/ofl/dmsans)
