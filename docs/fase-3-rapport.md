# Fase 3 – sider og brugerflows

Implementeret på `feature/fase-2-6` oven på fase 1-referencecommit `04aef1b` og carousel-commit `0d0d3b6`.

## Sider

- Events V2 med tre Figma-eksempel-events, kategori-filtre, URL-parametre og browserhistorik.
- Kalendervisning med november 2026, korrekt søndagsstart, seks uger og links til de tre events. Ingen rigtig kalender ændres.
- Fire eventdetaljer: Design & nye forbindelser, Idéer på papir, Design i virkeligheden og Et bord, nye ansigter.
- Fire tilmeldingsdemoer med tydelig »IKKE tilmeldt«-bekræftelse og retur til event.
- Fire kalenderdemoer med tydelig »Intet er tilføjet«-besked.
- Om KindDesign V2 med de godkendte communityfotos og portrætmarkeringer, der afventer tilladelse.
- Ny her med trin, spørgsmål/svar og medlemskort-koncept.
- Kontakt V2 med tre emnekategorier, tastaturbetjening, rigtig frontendvalidering, fejloverblik, demobekræftelse og nulstilling.

Den gamle fase 1-dialognavigation er fjernet. Header, footer og CTA'er fører nu til lokale sider. Aktiv navigation markeres med `aria-current`. Alle sider har dansk sprog, én h1, sidetitel og beskrivelse. Der er 18 byggede HTML-sider i denne fase.

## Figma og faktagrænser

De aktive kilder er `776:1747`, `776:1817`, `776:1873`, deres mobilmodstykker `776:1915`, `776:1988`, `776:2047`, samt Ny her `753:1053`/`757:2779` og eventdetaljerne `753:951`, `753:1492`, `753:1540`, `753:1588` med mobilflows.

Figma-reactions blev aflæst: tilmeldingsknapperne peger på interne demoframes (`785:1760`, `785:1799`, `785:1838`), ikke eksterne Luma-URL'er. Der findes derfor ingen dokumenteret rigtig Luma-tilmelding i kilderne. Eventdatoer, adresser og nedtælling er stadig eksempeldata, ikke annoncerede bookbare events. Ingen Luma-adresse eller tilmelding er opfundet. Koden kan bruge en konfigureret HTTPS-eventadresse hos lu.ma/luma.com; uden en adresse anvendes Figma-demoflowet. Ingen ekstern booking er testet eller foretaget.

Kontakt er eksplicit »PROTOTYPE · Intet sendes«. Der er ingen fetch, POST, database eller lokal lagring af felternes data. Uden JavaScript er submit deaktiveret, så Enter heller ikke sender felter i en GET-query. Portrætter er ikke erstattet med billeder uden dokumenteret tilladelse. Medlemskort forbliver et koncept.

Mobil- og desktopframes har forskellige tekster, størrelser og fotos. Disse forskelle er bevaret med responsive kompositioner. Den seneste fontløsning med automatisk optisk størrelse er genbrugt.

## Verifikation

- Astro-build består: 18 statiske sider.
- 72 side/bredde-kombinationer er kontrolleret med Playwright: 12 repræsentative ruter ved 390, 600, 601, 768, 1024 og 1440 px. Ingen JavaScript-fejl, fejlede ressourceforespørgsler, manglende billeder eller vandret sideoverflow i den afsluttende runde.
- Axe A/AA på repræsentative sider ved 390 og 1440 px: ingen fund efter rettelser af kalenderfanernes og trinkortenes kontrast.
- Filtre: alle kategorier, URL, genindlæsning og tilbagehistorik består.
- Alle fire event→tilmeldingsdemo→bekræftelse→retur og kalenderdemoer er testet ved 390, 768 og 1440 px.
- Kontakt: tomme felter, ugyldig e-mail, korrekt udfyldning, bekræftelse, fokusretur og nulstilling består. Ingen POST eller localStorage-skrivning registreret.
- Carousel: automatisk skift og pause består; manuel loop og reduced-motion er tidligere testet ved alle tre referencebredder.
- Fallback uden JavaScript: kontakt kan ikke sende data, og den statiske carousel bevares.
- `scripts/check-build.js` verificerer alle byggede HTML-filer, interne ruter, ankre, assets, sprog, titler og h1'er.

En konkret kontaktfejl blev rettet: blur-validering kunne flytte submitknappen under et klik. Fejl opdateres nu ved indtastning efter første validering og ved submit.

## Visuel QA

Fuldsidescreenshots ved 390, 768 og 1440 px findes i `docs/qa/fase-3`; fulde V2-referencer, overlays og mål er i `references`, `overlays` og `visual-comparison.json`. De mobile V2-sider er sammenlignet inklusive alt indhold under folden. Desktop Ny her og den første eventdetalje er også direkte sammenlignet. De øvrige eventdetaljer anvender samme layout med deres egne aflæste fotos og tekster.

Mobilens eventkort er rettet til 220 px fotos, 28 px kortoverskrifter, præcise 28 px sektionsgaps og eksplicit eksempelprogram. Om-sidens mobilspacing er rettet efter de aflæste 48 px hovedgaps og de særlige founder-/historiegrupper. Desktopkort, teksthøjder og praktisk-information-sektionen er ligeledes tilpasset de aflæste koordinater. En responsiv overflowfejl ved 601 px er rettet ved at stable historie og værdier, når kolonnerne bliver for smalle.

Resterende grænser:

- Små afvigelser i antialiasing, heltalsafrunding og komprimerede fotos består. Se de målte højder og overlays; der hævdes ikke bitidentitet.
- Ny her og eventdetaljers legacy-mobilframes har 844 px klippende parentframes. Hele indholdslaget er aflæst, og hele kodesiden er screenshotkontrolleret. Et nyt direkte fuldsideoverlay kunne ikke oprettes: Figma-værktøjerne til midlertidig eksportkopi blev utilgængelige i sessionen, før disse kopier blev lavet. Originalerne er ikke ændret.
- Der findes ingen 768 px-reference. Tablet og mellembredder følger de eksisterende grid-, spacing- og stablingsprincipper.
- Funktionskrævende kontroller er semantiske knapper, labels og native felter. Mindre formkontrolforskelle mellem browsere er forventelige; Safari/Firefox er endnu ikke kontrolleret.

## Kodegennemgang

`src/data/events.js` samler Figma-eksempeldata og validerer valgfri Luma-konfiguration. Astro bygger detail-/demoruter med `getStaticPaths()`. `InnerLayout` genbruger BaseLayout, Header og Footer. CSS er afgrænset med `.inner-page`, så forsiden bevarer sin identitet. `events.js` filtrerer DOM-kort og opdaterer historikken. `contact.js` validerer felter og viser den lokale demobekræftelse. Ingen ekstra applikationsdependencies er tilføjet.

Supabasevurdering, lokal Netlify-klargøring og samlet QA fortsætter i de efterfølgende faser.
