# Evidens til KindDesign UX/UI Deep Audit

10. november 2026. Alle webtests i denne mappe retter sig mod den eksisterende offentlige HTTPS-version. Applikationskode er ikke ændret.

Hovedrapport: [kinddesign-ux-ui-deep-audit-2026-11-10.md](../../kinddesign-ux-ui-deep-audit-2026-11-10.md).

## Grundlag og fortolkning

- [version-and-scope.json](version-and-scope.json): branch, HEAD, publiceret deploy og afsluttende uændrethedskontrol.
- [source-baseline-sha256.json](source-baseline-sha256.json): SHA256 af 118 versionsstyrede applikations-, asset-, test- og konfigurationsfiler ved auditstart. Alle uændrede ved afslutning.
- [public-integrity.json](public-integrity.json): ny kontrol af 37 offentlige buildfiler mod det tidligere dokumenterede rene artifact fra `3f2ce0b`.
- [test-manifest.json](test-manifest.json): testomfang, resultater og afgrænsninger. Nul automatiske a11y-fund er ikke en WCAG-godkendelse; se de manuelle kontrast-/tekstafstandsfund.

## Browserkørsler

| Mappe/fil | Indhold |
| --- | --- |
| `pages/` | 189 fuldscreenshots: 27 ruter × 320/375/390/430/768/1024/1440. Viewporthøjde 900. Harness scroller alle sektioner og decoder billeder før afsluttende måling. `pages.json` indeholder resultater og dimensioner. Axe køres ved 390/1440, bortset fra fire kalenderdemoruter: 46 scanninger. |
| `overview/` | Mærkede, nedskalerede kontaktark af alle 27 sider ved 390/1440. Layoutoverblik; brug de originale PNG'er for tekst og billeddetaljer. |
| `interactions/` | Nye kørsler af eksisterende carousel-, FAQ/nav-, official-flow-, demo/form- og smoke-tests med offentlig base-URL. Testene er ikke fuld dækning af alle mulige interaktioner. |
| `focused-checks.json` | Naturlig Pause → Play-sekvens med bevaret fokus og 10 sekunders ventetid; header/CTA/kalendergeometri; 12 filterkombinationer; konteksttab; kontaktkanaler. |
| `nav-and-a11y.json` | 63 centrale klikrejser, tabrækkefølge, hovergeometri, otte ekstra bredder på tre sider og 14 eksplicitte WCAG 2.2-scanninger. `nav-observations.json` er delresultat før axe. |
| `nav-active-contrast.json` | Faktiske navfarver, størrelser/vægte og headerbaggrund ved 320/1440. Ny her desktop ligger på lyseblå CTA, så headerbaggrunden er ikke denne teksts nærmeste baggrund. |
| `token-contrast.json` | WCAG-relativ-luminansberegning af faste tokenpar. Verificerer ikke kontrast over fotos. |
| `image-stability.json` | Eventcovers forsinkes i frisk browser til første kort er i viewporten. Fonte er klar før baseline; derefter frigives og decodes alle covers. Registrerer geometri og layout-shift entries ved 390/1440. |
| `final-probes.json` | Browserfonte/typografi/billedslots ved 320/390/768/1440 på syv centrale sider, samme 28 kontroller med fire brugerdefinerede tekstafstande samt kun boolesk aflæsning af Lumas pris/godkendelse. |
| `source-font-axes.json` | Genlæsning af `fvar` i de arkiverede TTF-kildefiler via standard Python `struct`; ingen fontfil ændres. |
| `native-zoom.json` | Observeret native Chrome 200/400 %, CSS-viewport, scrolling og gendannelse til 100 %. Ingen filesystem-screenshots af zoommenuen. |
| `luma-external-check.json` | Read-only læsning af otte officielle eventlinks, HTTP-status, titel og Event JSON-LD. Ingen booking eller deltagerdata gemt. |
| `performance/lighthouse/` | 16 nye sekventielle Lighthouse JSON-rapporter og `summary.json`; mobil390×844/desktop1440×900, DPR1, normal Lighthouse mobil-/desktopthrottling. Én kørsel pr. side/device. |
| `performance/details-summary.json` | Udtræk af TBT, requests, bytes, tredjeparts-URLs og LCP/opportunities fra samme rapporter. |
| `findings/` | Konkrete tilstande og målinger omtalt i hovedrapporten. |
| `references/` | Friske Figma-headereksporter og en mærket Figma/live-sammenstilling; ingen Figma-edits. |

Normale sidescreenshots er fra uændret livekode. Tekstafstand-screenshots bruger kun en midlertidig stylesheet i testbrowseren: line-height1.5, paragraph-spacing2em, letter-spacing.12em, word-spacing.16em. De beskårne `text-spacing-hero-*.png` isolerer det dokumenterede hero-fund. Eventuelle ikke-færdigindlæste offscreen-carouselkort i de tidlige fuldscreenshots fra dette særskilte probe er ikke brugt som bevis på et billedproblem; den normale fuldsidematrice og den særskilte carouseltest afventer billederne.

`images-pending-*` og `images-decoded-*` viser to indlæsningstilstande i samme kodeversion. Der er ingen før-/efter-implementering i denne audit. En PNG alene beviser ikke autoplay, fokus eller swipe; læs de tilhørende JSON-resultater.

## Reproduktion

De eksisterende scripts fra `scripts/qa/` er kopieret til midlertidige filer, hvor base-URL og evidensmappe er ændret. Sidematricen er udvidet med bredder og hele-siden-scroll. Nye afgrænsede read-only probes er også midlertidige. Præcise kopier er bevaret som **tekst** i `harness/*.cjs.txt`; logs ligger samme sted. De er dokumentation, ikke nye applikationsscripts eller ændringer af testpakken.

Kørslerne anvendte Node i `/tmp/kinddesign-tools/node_modules/node/bin/node`, Playwright/Chrome, axe og Lighthouse fra `/tmp/kinddesign-tools`. Stier skal tilpasses et andet miljø. Browserstyringen foretager GET og lokale DOM/UI-interaktioner. Kontakt-/demoflows sender ingen POST, og Luma undersøges uden indsendelse. Lighthouse kører sekventielt uden konkurrerende browserkørsler.

Komponenternes nye acceptkriterier i rapporten er **fremtidige implementeringstests**. De er ikke markeret bestået. KD-02 viser konkret, at en grøn eksisterende regressionstest kan overse en naturlig fokussekvens.
