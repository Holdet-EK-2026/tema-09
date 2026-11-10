# KindDesign – UX/UI Deep Audit

10. november 2026 · Read-only audit af [det publicerede website](https://kinddesign-holdet-ek-2026.netlify.app/).

## 1. Executive summary

KindDesign har en tydelig identitet, autentisk fotografi og velfungerende grundnavigation. De centrale sider, de officielle eventdetaljer og overgangen til Luma kan bruges. Den tidligere rettede autoplay starter uden brugerinput, og FAQ-accordions fungerer. Der er ingen observerede P0-fejl.

Sitet bør dog ikke præsenteres som et færdigt, tilgængeligt kundesite endnu. Auditens vigtigste fund er:

1. **Navigation og tilgængelighed:** Headeren skaber vandret overflow over 1440 px. Aktive tekstlinks på salviebaggrunden har kun **4,373:1** i kontrast. Forsidens faste hero klipper indhold ved brugerdefinerede tekstafstande.
2. **Carousel:** Efter et almindeligt klik på Pause → Afspil kan autoplay forblive stoppet af knappens fokus, mens knappen viser “Pause”.
3. **Kontakt:** Formularen er ærligt mærket som prototype, men siden tilbyder ingen faktisk kontaktkanal. Det er en kendt produktbegrænsning, ikke en ny afsendelsesfejl.
4. **Kalender:** Månedsvalg og datoer ligger under første skærmbillede, også på desktop. Den gentagne eventpræsentation prioriteres over kalenderens egentlige opgave.
5. **Events:** Én kommende begivenhed og syv afsluttede begivenheder får næsten samme vægt. Oversigten bliver 7.699 px høj ved 390 px. Det giver et tungt udgangspunkt for at finde næste relevante arrangement.

Der er **7 P1-anbefalinger, 8 P2-anbefalinger og 1 P3-anbefaling**, samlet i afsnit 15. Flere handler om observeret adfærd; andre er begrundede UX-vurderinger eller betingelser før en egentlig lancering. Ingen af anbefalingerne er implementeret i denne audit.

Aktuelle resultater: **189 side/bredde-kontroller**, de eksisterende browserregressionstests bestået inden for deres assertions, **16 nye Lighthouse-målinger**, native Chrome-zoom ved 200/400 %, supplerende WCAG 2.2-scanninger og målrettede reproduktioner. Automatiske accessibility-resultater på 100 og nul axe-regelbrud ophæver ikke de manuelt fundne kontrast- og tekstafstandproblemer.

## 2. Teknisk versions- og testgrundlag

| Forhold | Aktuelt grundlag |
| --- | --- |
| Lokal mappe | `kinddesign/` i T09-workspacet |
| Branch | `feature/ux-ui-final-qa` |
| Lokal HEAD | `db42f51` – dokumentation efter deployment |
| Publiceret applikationskode | `3f2ce0b6366ff732bd76e961be8bf5f1fbdcd90e`, inklusive `3c46dd6755adfd28c0cd92107c110a73d645bc03` |
| Netlify-site | `8cae5019-b5f0-4a43-b9d3-3d33e9363d5e` |
| Publiceret deploy | `6af34a2e5ac8ad72cd7e9c25`, aktuelt deploy, `ready` ved ny aflæsning |
| Kilde til deploy | Manuel CLI-publicering. Netlify udfylder ikke Git `commit_ref` for denne forbindelse. |
| Sammenhæng mellem kilde og live | Ny hashkontrol: 37 offentlige HTML/CSS/JS/WOFF2/ICS-filer matcher den tidligere dokumenterede rene build byte for byte. Det forbinder liveversionen med kildecommittet; det er ikke udledt af en tom Netlify-commitreference. |
| Applikation | Astro 7.4.8, statiske sider og Vanilla JavaScript. Kun Astro som runtime-dependency i `package.json`. |
| Browser/runtime | Playwright 1.65, installeret Chrome, axe-core 4.14 og Lighthouse 13.6 via isolerede værktøjer i `/tmp`; Node 22.23.4. |

Git var ren ved start. Applikationsfilerne er kun læst. En baseline af 118 versionsstyrede kode-, asset-, test- og konfigurationsfiler bruges til afsluttende uændrethedskontrol. Rapport og ny evidens er de eneste tilsigtede tilføjelser. Ingen push, commit, merge, deployment, booking, kontaktbesked eller ændring i eksterne systemer er foretaget under auditten.

Læst dokumentation: [fase 1](fase-1-rapport.md), [fase 2–6](fase-2-6-rapport.md), [seneste UX/UI-QA](kinddesign-final-ux-ui-qa.md), [dokumentation](dokumentation.md) og [deploymentrapport](deployment-ux-ui-2026-11-10.md). Tidligere resultater er historik; tallene herunder stammer fra nye kørsler mod HTTPS-sitet. Ny production build er ikke kørt: auditten undersøger den eksisterende publicerede build.

Installerede skills er undersøgt og relevante instruktioner læst: `website-qa-director` styrer test/evidens, `mmd-design-reviewer` den konkrete designkritik, `ai-slop-auditor` indholds- og kvalitetskontrol, `ux-research-director` sondringen mellem observation og antagelse og `mmd-figma-style` bevarelse af projektets visuelle grundlag. Der er ikke udført et brugerstudie, og tekstens kvalitet bruges ikke til at påstå noget om dens forfatterskab.

Figma-reference: [KindDesign](https://www.figma.com/design/upaKrrIg3bRBgo4Md8s12F), aktive prototypeframes og eksisterende design tokens. Friske headerreferencer er hentet fra Events `776:1748`, Ny her desktop `753:1054`, Ny her mobil `757:2781` og Om mobil `776:1989`. Eksisterende fuldsidereferencer i projektet bruges som supplerende designhistorik, ikke som bevis for en ny fuld pixelidentitet.

Evidens: [liveintegritet](qa/deep-audit-2026-11-10/public-integrity.json), [versionskontrol](qa/deep-audit-2026-11-10/version-and-scope.json), [testharness og logs](qa/deep-audit-2026-11-10/harness/), [evidensoversigt](qa/deep-audit-2026-11-10/README.md).

## 3. Overordnet UX/UI-vurdering

**Tre største styrker:**

- Fotografier, farver og editorial typografi skaber et genkendeligt fællesskab. Billederne viser konkrete situationer frem for generiske stockmotiver.
- Besøgende får et tydeligt formål og en anvendelig vej til Events. “Ny her?” svarer på reel førstegangsusikkerhed, mens Om beskriver initiativet.
- Grundfunktionerne er enkle: almindelige links, URL-baserede filtre, lokal tidszone, tydelig afsluttet-status, direkte Luma-links og ærlige demobeskeder. Der er ingen unødvendig backend eller tung klientapplikation.

**De fem vigtigste svagheder** er navigationens responsive/tilgængelighedsmangler, Play-adfærden, kontaktens manglende kanal, kalenderens prioritering og Events-arkivets dominans, som beskrevet i afsnit 1. Kalender og Events har det svageste opgavehierarki. Den mest forvirrende tilbagevej er et filtreret eventbesøg, hvor sidens eget tilbage-link nulstiller brugerens valg.

Sitet er egnet til en **kundepræsentation som gennemarbejdet prototype med tydeligt oplyste begrænsninger**. Det er ikke klart til at blive lovet som færdig kontaktløsning eller fuldt WCAG 2.2 AA-verificeret website. Brand og grundlæggende informationsarkitektur bør bevares; der er ikke belæg for et generelt redesign.

## 4. Gennemgang af alle sider

Alle 27 HTML-ruter er åbnet i rigtig Chrome ved alle syv krævede bredder. Harnessen scroller igennem hele dokumentet, indlæser/decoder lazy billeder og tager et fuldscreenshot. Helheder og sektioner under folden er gennemgået i screenshotoversigter; konkrete fund er efterprøvet særskilt. Dette er en ekspertgennemgang, ikke observation af repræsentative deltagere.

| Side/rute | Gennemgået indhold og tilstand | Vurdering/fund |
| --- | --- | --- |
| `/` | Hero, eventcountdown, carousel, communitytekst, CTA og footer | Formål og eventvej er tydelige. Ingen normal afklipning ved 320–1440. KD-01/02/03/16 og valgfri KD-15. |
| `/events/` | Hero, introduktion, begge filtergrupper, alle otte kort, tomtilstand, Ny her-banner og footer | Korrekte resultater/status, men lang arkivdominans, dobbelt mobilfokus, konteksttab og billedbetingede layoutskift. KD-06–09. |
| `/events/kalender/` | Eventfeature, foto, visningslinks, månedsvalg, datogitter, kilde og samarbejds-CTA | Kalenderen virker; den kommer for sent på siden. KD-05/07. |
| `/om-kinddesign/` | Introduktion, begge founderpræsentationer, historie, værdier, mobil-CTA'er og footer | Sammenhængende. Ingen manglende foundertekst eller clipping. Gentagelse af oprindelseshistorien kan redigeres, men kræver ikke sektionssletning. |
| `/ny-her/` | Velkomst, deltagelsesvej, tre steps, alle tre FAQ-svar, CTA og footer | God arbejdsdeling med Om. FAQ fungerer med mus, touch og tastatur samt uden JavaScript. |
| `/kontakt/` | Introduktion, billede, labels/felter, emne, ugyldig indsendelse, fejloversigt, demobekræftelse og nulstilling | Ærlig prototype. Ingen data sendes, og der findes ingen alternativ mail/tlf. KD-04. |
| `/events/from-ballet-to-technology/` | Alle fakta, officiel cover, praktiske oplysninger, Luma/ICS, beskrivelse og program under folden | Kommende Tokyo-event; korrekt lokal tid. Mangler pris/godkendelseskrav før overgangen. KD-07/11. |
| `/events/ai-skillsharing/` | Fakta, cover, afsluttet-status, kilde og arrangementsbeskrivelse | Afsluttet, ingen aktiv tilmeldings-CTA. |
| `/events/real-talk/` | Samme struktur samt synlig datokonfliktnote | Afsluttet. 2026 i Lumas kalenderdata mod 2025 i tidligere beskrivelsestekst er allerede dokumenteret på siden; ikke skjult eller ny regression. |
| `/events/meetup-barcelona/` | Fakta, billede, programbeskrivelse og kilde | Afsluttet, korrekt direkte Luma-destination. |
| `/events/meetup-berlin/` | Fakta, billede, kilde samt uenighed om sluttid | Kun starttid fremhæves; konflikten forklares. Ingen opdigtet sikker sluttid. |
| `/events/meetup-cph-jul/` | Fakta, cover, beskrivelse og kilde | Afsluttet, ingen aktiv tilmelding. |
| `/events/meetup-nordhavn-2025/` | Fakta, cover, beskrivelse og kilde | Afsluttet, ingen aktiv tilmelding. |
| `/events/meetup-koebenhavn-september-2025/` | Fakta, cover, beskrivelse og kilde | Afsluttet, ingen aktiv tilmelding. |
| Fire `/events/<demo>/` | `design-og-nye-forbindelser`, `ideer-paa-papir`, `design-i-virkeligheden`, `et-bord-nye-ansigter`: hele detaljesiden, program, kontakt/praktik og konceptnote | Ikke i den primære officielle oversigt. Stadig direkte tilgængelige og mærket eksempel/demo. KD-12. |
| Fire `/tilmelding/<demo>/` | Samme fire slugs: forløb, demoknap og bekræftelse | Ingen rigtig reservation; tilstanden er ærligt beskrevet. |
| Fire `/kalender/<demo>/` | Samme fire slugs: kalenderdemo, besked og tilbage-link | Ingen faktisk kalenderændring. |
| `/findes-ikke/` | Egen 404, forside-CTA og fælles navigation/footer | HTTP 404 og anvendelig vej videre. |

[Alle 189 resultater](qa/deep-audit-2026-11-10/pages/pages.json) indeholder rute, bredde, HTTP-status, ressourcefejl, dimensioner, h1, billeder og sektioner. [Screenshotoversigter](qa/deep-audit-2026-11-10/overview/) omfatter alle 27 ruter ved 390/1440; fuld opløsning ved hver af de syv bredder ligger i [pages](qa/deep-audit-2026-11-10/pages/).

## 5. Navigation & Header Audit

### Desktop, tablet og Figma

| Egenskab ved 1440 px | Forside live | Events/Om/Kontakt live | Ny her/kalender live | Reference og vurdering |
| --- | --- | --- | --- | --- |
| Headerhøjde | 116 px | 107 px | 116 px | V2/legacy har forskellige Figma-højder. Forskellen er ikke i sig selv en fejl. |
| Logo | 90×90, x64/y12 | Samme | Samme | Matcher størrelse/placering i de læste desktopreferencer. |
| Navfont | DM Sans 18/700 | DM Sans 18/400 | DM Sans 18/400 | Tilsigtede fontvarianter; ikke fallback eller syntetisk bold. |
| Første links x/y | 480/46,75 | 461/42,25 | 461/46,75 | Events-reference har x480/y46. V2 ligger 19 px til venstre og 3,75 px højere. |
| CTA x/y, størrelse | 1229/30, 165×56 | 1191/25,5, 165×56 | 1191/30, 165×56 | Events-reference: 1210/30, 165×56. CTA flytter 38 px mellem forside og V2. Ny her-reference har særskilt 115 px CTA; en fælles 165 px CTA er en eksisterende konsolidering, ikke ny fejl. |

[Frisk Figma/live-sammenstilling](qa/deep-audit-2026-11-10/references/figma-live-nav-events.png), [geometri og scrollpositioner](qa/deep-audit-2026-11-10/focused-checks.json).

**KD-10 – UX/UI-vurdering med målt afvigelse:** Gør den horisontale navigation og CTA's optiske placering konsekvent ved hjælp af eksisterende container-/spacingregler. Bevar de begrundede 107/116 px varianter, medmindre et fælles referencevalg vedtages. Forskellen kræver ikke en ny logo- eller knapstørrelse. Den 165×56 px CTA er anvendelig og ikke generelt for stor; eventvejen har allerede prioritet i heroen.

**KD-01 – verificeret fejl:** Over 1440 px øges navgap med `2vw`, mens navens bredde bliver 914 px, kolonnerne er faste, og CTA har ekstra venstremargin. Ved 1920 px måles forsiden til **1960 px scrollWidth** og CTA-højrekant **1959,56 px**. Events og Ny her bliver 1922 px. Ved 1536 px bliver forsiden 1545 px; ved 1600 px 1614 px. Dette er en faktisk desktopfejl uden for de oprindeligt rapporterede referencebredder. Ret pladsberegningen, ikke ved blot at skjule body-overflow.

[Screenshot 1920](qa/deep-audit-2026-11-10/findings/header-overflow-home-1920.png), [målinger inklusive 1441/1536/1600/1920](qa/deep-audit-2026-11-10/nav-and-a11y.json).

Ved 601/640 px bliver desktopnavigationen tæt på logoet; ved 601 starter første link præcis ved logoets højrekant. Der er ikke målt overflow eller overlap i de normale kontroller. Mere luft er et eventuelt polishvalg, ikke dokumenteret grund til at indføre en hamburger.

### Default, hover, fokus, aktiv og pressed

- Nav-understregning: **1 px**, fuld bredde ved hover/fokus/current, ca. **4 px** plads under teksten og **240 ms ease**. Browserens linkrektangel er identisk før/efter hover. Timing passer til udtrykket og bør bevares.
- Aktiv side har vedvarende understregning og `aria-current="page"`; det afhænger ikke af hover. Events er også aktiv på event- og demoruter.
- Tastatur: skip-link → logo → synlige links. Mobilrækkefølgen følger det visuelle layout. Skjult desktopnav er ikke et ekstra sæt tabstop på mobil.
- `:focus-visible` giver **3 px solid outline**. CTA og relevante knapper har diskret inset-feedback ved pressed. Links følger normal browsernavigation; de behøver ikke en kunstig disabled-state.
- Reduced-motion slår transitions fra. Ingen ny dekorativ animation anbefales.
- **KD-16 – verificeret kontrastfejl:** Aktive navtekster på salvie bruger `#722f37` mod `#a5b39b`: **4,373038:1**. De målte 14 px/400 på mobil og 18 px/400 på undersider kræver 4,5:1; forsidens 18 px/700 er også under grænsen for stor fed tekst. Den lyseblå desktop-CTA er en anden baggrund og er ikke omfattet af netop dette fund. Brug fx det eksisterende `--tekst` til aktiv tekst og behold understregningen. Det giver **8,20:1** mod salvie uden at ændre paletten. [Browserfarver](qa/deep-audit-2026-11-10/nav-active-contrast.json), [beregning](qa/deep-audit-2026-11-10/token-contrast.json), [W3C om kontrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

### Mobilmenu, små højder og scrolling

Mobilen har **fire permanent synlige links**, ikke en skjult menu: Events, Om os, Ny her?, Kontakt. Dette følger de læste mobilframes. Hamburger, åbne-/lukkeanimation, Escape-lukning, scroll-lock og dialog-fokusstyring er derfor **ikke relevante tilstande**, ikke manglende funktioner.

Headeren er 144 px med 54×54 px logo og 18 px padding. Ved 320 px er navlinkene ca. **68×44,30 px**. De fungerer uden hover og er ikke klippet. Forsidens primære event-CTA ligger ved y446–497, også ved 320 px; den er synlig i den supplerende 568 px høje viewport. Headeren er relativt høj, men de synlige valg har en konkret fordel. Der er ikke belæg for at skjule dem alene for at spare højde. Logoets centrerede forsidevariant og undersidernes venstrevariant følger forskellige referencer.

Headeren er **ikke sticky**. Ved scrollY700 forlader den viewporten; den ændrer ikke højde eller dækker overskrifter. Sticky/shrinking header er derfor ikke fejlrettelser og anbefales ikke uden et senere påvist navigationsbehov.

### Rejser, struktur og footer

Alle fire centrale header- og footerrejser samt logo → forside er klikket ved de syv krævede bredder: **63 navigationer består**. Rejsen forside → Events → officiel detalje → korrekt Luma-adresse består også. [Navigationsbevis](qa/deep-audit-2026-11-10/nav-and-a11y.json), [officielle flows](qa/deep-audit-2026-11-10/interactions/official-flows.json).

**KD-07:** Sidens “← ALLE EVENTS” leder altid til ufiltreret `/events/`. Talk + Kommende giver ét resultat før detaljebesøget og otte bagefter. Det er en forståelig bogstavelig label, men en svag kontekstuel tilbagevej. Kalenderens valgte måned/tab går tilsvarende tabt. Browserens egen Tilbage bevarer URL-konteksten; dette er ikke et generelt history-brud.

Informationsarkitekturen er passende: Events er handling, Om er identitet, Ny her er førstegangsvejledning og Kontakt er dialog. Om og Ny her overlapper emnemæssigt, men løser forskellige opgaver. Sammenlægning eller flytning af Kontakt til footer er ikke underbygget. Mobilens manglende særskilte Forside-link opvejes af et tydeligt logo-link.

Footerens logo på desktop, afsluttende budskab og fire links giver en naturlig afslutning. Mobilen skjuler logoet, men bevarer alle links. Gentagelsen af hovednavigationen er nyttig efter lange sider. Der er ingen verificeret mail, telefon eller sociale links i footeren; det forstærker KD-04. Tilføj kun ejerbekræftede kontakt-/profiloplysninger, ikke opdigtede konti. Standardkontrast og focus fungerer; aktive headerlinks er den særskilte kontrastafvigelse ovenfor.

## 6. Events UX/UI Deep Dive

### Oversigt og valg

Der er otte officielle poster: **1 kommende, 7 tidligere** pr. auditdato. Statuslabels er korrekte og tidligere events har ingen aktiv tilmeldings-CTA på detaljesiden. Titel, dato, år, by og lokal tidszone er tilgængelige som HTML; covertekst er ikke eneste informationskilde.

**KD-06 – UX/UI-vurdering:** Standardvalget “Alle datoer” fremstiller et stort arkiv som hovedopgaven. Ved fuldt indlæste billeder er Events 8.301 px høj ved 320, 7.699 px ved 390 og 4.935 px ved 1440. Ny her-banneret og footer er langt væk på mobil. Prioritér “Kommende” ved første besøg eller del kommende og arkiv i tydelige blokke med adgang til alle tidligere events. Bevar historikken og de autentiske covers. Vis gerne et synligt resultatantal og byen tæt på næste event. Et kommende Tokyo-event må ikke omdøbes til et København-event for at passe til en lokal fortælling.

**KD-09 – forbedringsmulighed:** De otte kort giver 16 tabstop på mobil: både titel og “Se event” linker til samme detalje. Desktop har otte. Ét samlet, tydeligt navngivet kortlink pr. event kan reducere gentagelse uden at fjerne den synlige CTA. Det er ikke i sig selv et dokumenteret WCAG-brud.

### Filtre og tomtilstand

Alle **12 understøttede kombinationer** af Alle/Meetup/Workshop/Talk × Alle datoer/Kommende/Tidligere er afprøvet. Indhold, aktive `aria-pressed`-tilstande, URL-parametre og annonceret antal stemmer. Tomtilstanden er synlig ved nul resultater; “Vis alle events” nulstiller og flytter fokus tilbage til første filter. Reload og browserens Tilbage virker. [Kombinationsresultater](qa/deep-audit-2026-11-10/focused-checks.json), [tomtilstand](qa/deep-audit-2026-11-10/findings/events-empty-390.png).

Der er ikke belæg for flere filtre med kun én kommende begivenhed. Et geografisk filter er en senere mulighed, hvis kataloget vokser. Afstanden mellem to filtergrupper er forståelig; de bør samles visuelt med en eventuel ny kommende/arkivprioritering frem for at blive genimplementeret separat.

### Kalender

Danske månedsnavne, mandag–søndag, eventmarkeringer og links til detaljer fungerer. Måned vælges i et native select; der findes ikke forrige/næste-pile, som skal testes som eksisterende funktioner. URL `?month=2025-12` viser to events, november 2026 det aktuelle event. History og tilhørende ICS-download består. Datoer forklares som eventets lokale tidszone.

**KD-05 – UX/UI-vurdering med mål:** Ved 390×844 begynder månedsvalget ved **y958,78** og gitteret ved **y1035,78**. Ved 1440×900 er de ved **y1084,59/y1161,59**. Ved 320 er månedsvalg y1059,17. En stor eventfeature og et ekstra communityfoto kommer først. Det er teknisk korrekt, men svagt for en bruger, der netop har valgt “Kalendervisning”.

Anbefaling: behold fotos og tone, men lad en kompakt overskrift, valg af måned og begyndelsen af datoerne være første opgaveblok. Placer featurehistorien sekundært. Med kun otte spredte events er en prioriteret liste den bedste standard; kalenderen kan bevares som valgfri datoindgang. [Mobil](qa/deep-audit-2026-11-10/findings/calendar-first-viewport-390.png), [desktop](qa/deep-audit-2026-11-10/findings/calendar-first-viewport-1440.png).

### Detaljer og Luma

Alle otte gemte officielle Luma-destinationer svarer **HTTP 200**. Deres titler og strukturerede datoer er genlæst; Tokyo er **13. november 2026 kl. 18.30–20.00, Asia/Tokyo**, venue Vague. Der er ikke observeret et forkert direkte link eller et afsluttet event med aktiv tilmelding på KindDesign. Lumas egne sider er eksterne og kan ændre sig efter auditten. [Ny kontrollog](qa/deep-audit-2026-11-10/luma-external-check.json).

| Luma-id | Arrangement | Aktuel struktureret start, lokal tid |
| --- | --- | --- |
| `cmapoye1` | From Ballet to Technology | 13.11.2026 18.30 +09:00 |
| `c3bj5f9d` | AI skillsharing | 29.10.2026 18.00 +01:00 |
| `c3jcu29h` | Real-talk | 01.07.2026 18.00 +02:00 |
| `n6nwx061` | Barcelona | 14.05.2026 18.00 +02:00 |
| `84v57ubf` | Berlin | 18.12.2025 18.30 +01:00 |
| `iq2qpyk4` | CPH xmas | 17.12.2025 18.00 +01:00 |
| `jdv50gdz` | Nordhavn | 29.10.2025 18.00 +01:00 |
| `bszies4x` | København september | 17.09.2025 18.00 +02:00 |

Den [officielle profil](https://luma.com/user/kinddesign) viser “10 Hosted”. Det tal er ikke dokumentation for, hvilke yderligere to events der eventuelt bør være i det lokale katalog. Ingen nye begivenheder er opfundet. Kataloget er en manuelt verificeret samling, ikke en automatisk Luma-synkronisering. Konflikter om Real-talk-årstal og Berlin-sluttid er allerede synlige kildeforbehold; arrangøren må afklare dem.

**KD-11 – forbedringsmulighed:** [Tokyo-eventets Luma-side](https://luma.com/cmapoye1) viser ved den nye læsning **JP¥1.000**, **Approval Required** og **Request to Join**. KindDesign oplyser, at pris/pladser/vilkår findes på Luma, så siden lover ikke gratis adgang. Men “Tilmeld dig” kan give en forventning om øjeblikkelig reservation. Vis de verificerede krav nær CTA'en, fx at man anmoder om en plads, og angiv kontroltidspunkt. Gør manuel vedligeholdelse af kommende events til en ejeropgave, især efter 13. november. Ingen unødvendig backend er nødvendig for otte poster.

Luma-destinationer er kontrolleret uden at foretage registrering, betaling eller ændringer. Rejsen frem til ekstern side er verificeret; et gennemført køb, en e-mail eller en godkendelse er **ikke** testet.

## 7. Carousel Audit

Den aktuelle publicerede version indeholder autoplayrettelsen. Her er to faktiske skift uden carouselinput:

| Bredde | Første skift | Andet skift |
| --- | --- | --- |
| 390 | 4.481 ms | 8.982 ms |
| 768 | 4.399 ms | 8.899 ms |
| 1440 | 4.502 ms | 9.001 ms |

Afvigelsen fra præcis 4.500 ms skyldes observationens start/sampling; kontrolleret tid bekræfter selve intervallet på 4.500 ms. Loop i begge retninger, automatisk wrap, piletaster, hoverpause, fokusstop, pointerhold, offscreen, reduced-motion og Chrome-touch/swipe består de eksisterende assertions. Faneskjul er testet som simuleret `visibilitychange`, ikke en fysisk baggrundsfane. Ingen utilsigtet navigation ved swipe. [Resultater](qa/deep-audit-2026-11-10/interactions/carousel.json).

**KD-02 – verificeret fejl i eksplicit genstart:**

1. Åbn forsiden med no-preference og scroll carousellen ind.
2. Klik Pause og derefter Afspil.
3. Flyt musen uden for carousellen, men flyt ikke tastaturfokus fra knappen.
4. Vent 10 sekunder.

Indeks bliver på 0. `data-user-paused=false`, men `data-autoplay=paused` og `data-pause-reason=focus`; knappen viser “Pause”. De normale tests kan bestå, fordi deres hjælpefunktion også fjerner fokus. Det dækker ikke denne naturlige kliksekvens. Fundet er adskilt fra den tidligere rettede hover-pause over introduktionsteksten.

Lad et udtrykkeligt Afspil-valg starte rotation trods det aktuelle kontrolfokus, og afstem label/status med den faktiske tilstand. Bevar et almindeligt fokusstop ved indgang og brugerens Pause/reduced-motion-valg. Undgå at løse problemet ved automatisk at fjerne fokus. Placér gerne rotationskontrollen før forrige/næste i fokusordenen i samme rettelse. [Reproduktion og states](qa/deep-audit-2026-11-10/focused-checks.json), [screenshot](qa/deep-audit-2026-11-10/findings/carousel-play-focus-1440.png). Dette følger hensigten i [WAI's carouselmønster](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) og [deres eksempel med eksplicit rotationsstart](https://www.w3.org/TR/2021/NOTE-wai-aria-practices-1.2-20211129/examples/carousel/carousel-1-prev-next.html); APG er vejledning, ikke en selvstændig WCAG-certificering.

Visuelt er centralkort, dæmpede nabokort, overlap og glasramme vellykkede. Den cirka 800 ms transformovergang føles rolig i forhold til 4,5 sekunders interval. Foto-/retinatests vælger større autentiske kilder ved behov. Kontrollerne er kompakte og forståelige; den tidligere store kontrolbjælke er væk. Carousellen understøtter identiteten og kræver ikke en ny 3D-/glasimplementering. Den fylder meget, men har et klart billedfortællende formål.

## 8. Typografi og visuel konsistens

Aktuelt browseraflæst: de anvendte fonte indlæses fra lokale WOFF2-filer. Bricolage står korrekt som `unloaded` på sider, der kun bruger DM Sans. Det er ikke en fontfejl.

| Element ved 1440 | Familie/vægt | Størrelse/line-height |
| --- | --- | --- |
| Forside h1 | Bricolage Grotesque 700 | 158/174 px |
| Forside community h2 | Bricolage Grotesque 700 | 58/73 px |
| Forside community body | DM Sans 400 | 22/28 px, 708 px tekstbredde |
| Events hero h1 | DM Sans 700 | 110/132 px |
| Events introduktion h2 | DM Sans 700 | 55/66 px |
| Eventkort beskrivelse | DM Sans 400 | 21/25,2 px |
| Ny her h1 | Bricolage Grotesque 700 | 64/80 px |
| Ny her brødtekst | DM Sans 400 | 24/30 px |

Mobilens forside h1 er 66/69 px; almindelig communitytekst er 17/25 px. De store titler fungerer i de normale smalle layouts. V2's tættere tekst/DM Sans og legacy's Bricolage er dokumenterede referencevarianter, ikke tilfældig fontblanding. Ny her og Om kan senere få fælles brødtekstregler, men ingen ny skriftfamilie eller generel skalering er nødvendig.

`font-optical-sizing:auto`, CSS-vægte 700/400, normal bredde og `font-synthesis:none` er bevaret. Der er ingen tvungen `opsz:14` eller andre `font-variation-settings`-overrides. Nul tracking/normal browsertracking bruges. De arkiverede kildefontes `fvar` er genlæst: Bricolage `opsz 12–96`, `wght 200–800`, `wdth 75–100`; DM Sans `opsz 9–40`, `wght 100–1000`. CSS-vægten bestemmer vægten, ikke Bricolage-filens standardvægt 800. [Akser](qa/deep-audit-2026-11-10/source-font-axes.json), [nye browseraflæsninger](qa/deep-audit-2026-11-10/final-probes.json). Den tidligere empiriske forklaring på Figma-rasterforskelle står i fase 1-rapporten; dette audit genkører ikke det gamle fontforsøg og påstår ikke pixelidentitet på tværs af renderere.

Containerkanter, fotoformater og farver hænger overordnet sammen. Afvigelser med tydelig konsekvens er prioriteret særskilt: KD-01/03/08/10/14/16. Små rasterforskelle og bevidste sidespecifikke h1-størrelser udløser ikke nye tickets.

**KD-14 – dokumenteret billedforvrængning, foreslået forbedring:** V2-heroens foto bruger et strakt billedlag: ved desktop er det ca. 1440×848 mod kildens 1600×1061, med `object-fit:fill`. Lighthouse markerer aspect-ratio på Events, Om og Kontakt. Det er en eksisterende referenceorienteret implementering, ikke et nyopstået coverproblem. Afprøv en beskæring med bevarede proportioner og tilsvarende motivplacering; sammenhold med Figma før en senere ændring. Brug samme autentiske foto. En æstetisk gevinst må ikke blot flytte afvigelsen til et nyt motivudsnit uden dokumentation.

## 9. Microinteractions

| Komponent | Undersøgt feedback | Resultat |
| --- | --- | --- |
| Navigation/tekstlinks | Default, hover, focus/current, geometri | Stabil 240 ms underline og synligt fokus. Aktiv kontrast KD-16. |
| CTA'er | Hover, focus, pressed | Diskret inset og ingen målt layoutforskydning. Bevar størrelserne, bortset fra responsive pladsregler KD-01. |
| Eventkort | Foto, titel, mobil-CTA, hover/fokus | Destinationer korrekte. Dobbelt mobil-tabstop KD-09. |
| Filtre | Pressed, hover, focus, nulresultat/reset, URL | Fungerer. Antal annonceres i live-region; synligt antal kan indgå i KD-06. |
| Kalender | Native select, aktiv visning, eventlink, reload/history | Fungerer. Det er placering og kontekst, der bør ændres, ikke en ny kalender-widget. |
| FAQ | Lukket/åben, klik, Enter/Space, hurtige skift, ARIA, reduced-motion | Ét åbent svar, korrekt plus/minus og sammenkobling. Alle oprindelige svar bevaret. No-JS viser svar statisk. |
| Carousel | Pause/play, pile, fokus/hover, touch | Almindeligt autoplay fungerer; særskilt eksplicit Play-fejl KD-02. |
| Kontakt | Labels, ugyldig formular, fokus på fejloversigt, demobekræftelse, reset | Forståelig feedback og ingen POST. Ingen reel loading/sendt-state, da der ikke findes afsendelse. |
| Legacy demo | Tilmelding og kalenderknap | Ærlige demotilstande uden ekstern ændring. |

Der er ingen skjult mobilmenu eller netværksbaseret intern loading-state at evaluere. Tilføj ikke spinners, toastbeskeder eller nye hover-effekter, hvor funktionaliteten allerede giver tilstrækkelig feedback.

[FAQ/hover/indhold](qa/deep-audit-2026-11-10/interactions/ux-interactions.json), [form/demo](qa/deep-audit-2026-11-10/interactions/flows.json), [fejlvisning](qa/deep-audit-2026-11-10/findings/contact-error-390.png).

## 10. Content Audit

- **Forside:** Budskabet forklarer fællesskabet og leder til Events. Countdown er relevant for det verificerede kommende event og angiver Tokyo; den må ikke læses som et kommende arrangement i København. Program- og udløbsbeskyttelse består. Foto/carousel viser fællesskabet. Introduktionen og den efterfølgende communitytekst gentager idéer/forbindelser; en lille redigering kan give hurtigere læsning, men begge sektioner har en funktion.
- **Om:** Founderbeskrivelserne og de tre værdier er bevaret; mobil-/desktopvarianter vises ikke dobbelt. Teksten om idéens oprindelse findes både i founder- og historiedelen. Kondensér højst formuleringer, ikke faktagrundlaget. Founderbiografier og billedsamtykker er ikke uafhængigt genbekræftet i denne audit; ejerafklaring før rigtig lancering er fortsat relevant.
- **Ny her:** De tre spørgsmål besvarer titelkrav, at komme alene og forberedelse. Det hjælper førstegangsbesøgende uden at overlove en bestemt modtagelse. Pris, sprog og eventuelle adgangsforhold bør ligge ved den enkelte begivenhed, når verificeret. Opret ikke nye praktiske løfter uden kilde.
- **Kontakt:** “PROTOTYPE · Intet sendes”, “Afprøv besked” og “Demobekræftelse / Intet er sendt” er tydelige. Der er ikke en falsk afsendelsesbekræftelse. **KD-04** beskriver den manglende reelle kontaktvej, ikke et behov for at gøre demoen mere overbevisende.
- **Events:** Officielle og eksempelbaserede events er adskilt fra den primære liste. Kildekonflikter forklares. “KindDesign”, “Kind Design” og “Kinddesign” optræder i UI/oprindelige titler; normalisér egne UI-labels ved almindelig redigering, men omskriv ikke eksterne eventtitler blot for konsistens.
- **Tidligere fjernet indhold:** Medlemskoncept, demopromovering på de centrale sider og udvalgte interne noter er fortsat væk. Det rapporteres ikke som aktuelle problemer. Ingen generisk placeholdertekst er fundet på de centrale sider.
- **KD-12 – betinget forbedringsmulighed før lancering:** Tolv legacy-demoruter er stadig offentligt tilgængelige, selv om de ikke promoveres i oversigten. De er mærket demo, og hele sitet er `noindex,nofollow`. Beslut en samlet produktionspolitik: behold demonstrationen i et særskilt preview/dokumentation, og gør kun godkendte ruter indekserbare, når produktet er klar. Fjern ikke beskyttelsen globalt før demo- og kontaktbeslutningen. Ingen sider er slettet her.
- **KD-15 – P3:** Redigér eventuelt forsidens gentagelse om at dele idéer/skabe forbindelser til én kort introduktion og én konkret “hvad sker der, når jeg møder op?”-tekst. Bevar billeder og personlig tone. Dette er valgfrit polish, ikke et påvist frafald eller bevis for AI-generering.

## 11. Accessibility

Automatiske kontroller: 46 axe-scanninger i sidematricen med WCAG 2 A/AA og 2.1 AA; yderligere 14 scanninger ved 320/1440 på syv centrale sider med eksplicitte WCAG 2.2 AA-tags. FAQ-, pause-/reduced-motion-, formular- og demotilstande har også nul automatiske fund i deres kørsler. **Alle 16 Lighthouse-a11y-scores er 100.**

De udvidede axe-resultater indeholder imidlertid **incomplete color-contrast** på alle 14 sider/bredder, blandt andet ved baggrundsbilleder og understregningsgradienter. De må ikke omskrives til bestået kontrast. Manuel aflæsning fandt KD-16. Faste tokenpar giver tekst/sand 13,34:1, bordeaux/sand 7,11:1 og tekst/salvie 8,20:1; **bordeaux/salvie 4,373:1 fejler for almindelig tekst**. Store overskrifter kan have et andet krav. Fuld kontrastverifikation af alle bogstavpositioner over fotos er ikke udført.

**KD-03 – verificeret tilpasningsfejl:** En browserstylesheet ændrede kun line-height til 1,5, afsnitsafstand til 2em, letter-spacing til 0,12em og word-spacing til 0,16em. Ved 320 px ender countdownens rektangel ved **y940,5**, mens heroen klipper ved **y834**. Den nederste tal-/linkdel forsvinder. Ved 768/1440 når eventteksten y1030, mens heroen slutter ved y1000. Faste højder/positioner, ikke en forkert font, er problemet. Lad tekstindhold bestemme minimumshøjde og giv countdown/CTA mulighed for at vokse; bevar standardlayoutet. [Mobilbevis](qa/deep-audit-2026-11-10/findings/text-spacing-hero-320.png), [desktopbevis](qa/deep-audit-2026-11-10/findings/text-spacing-hero-1440.png), [resultater](qa/deep-audit-2026-11-10/final-probes.json). Det er en fejl i testen for tilpassede tekstafstande, relevant for [WCAG 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html); sitet behøver ikke bruge disse afstande som standard.

Manuelle/browserbaserede kontroller omfatter:

- Ét h1 pr. side, meningsfulde landmarks, skip-link og logisk tastaturvej i de prøvede flows.
- Tydeligt fokus, FAQ's `aria-expanded/controls/labelledby`, native kontroller, formularlabels og fokus på fejloversigt/bekræftelse.
- Beskrivende alt-tekst til fortællende fotos og HTML-fakta ved covers. Gentagne coverlinks er skjult for tab/screenreader for at undgå samme billede som ekstra fokusstop; titel/CTA er tilgængelige.
- Reduced-motion stopper automatisk billedskift og unødvendige transitions. Fokus-/rotationsadfærd kræver KD-02.
- Mobilnavigationens ca. 44 px mål er gode. WCAG 2.2 AA's minimum er som udgangspunkt 24×24 CSS px med relevante spacing-/inlineundtagelser; 44 px er ikke et universelt AA-krav. Ingen automatisk `target-size`-overtrædelse blev fundet i de 14 udvidede scans. [W3C om minimumsstørrelse](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum).
- Native Chrome-zoom: 200 % på seks centrale sider gav 735 CSS px, 400 % på samme sider plus Tokyo gav 367 CSS px. Ingen vandret overflow; scrolling og indholdsovergang fungerede. Zoom blev gendannet til 100 %, og auditfanen lukket. [Målinger](qa/deep-audit-2026-11-10/native-zoom.json).

En rigtig VoiceOver-/NVDA-gennemgang med oplæsning er **ikke** gennemført. Browserens ARIA/DOM og automatiske tree-kontroller er ikke det samme som en skærmlæsertest. Sitet kan ikke erklæres fuldt WCAG 2.2 AA-overholdende på dette grundlag; KD-03 og KD-16 skal i alle tilfælde behandles.

## 12. Responsive QA

| Bredder | Omfang | Aktuelt resultat |
| --- | --- | --- |
| 320/375/390/430 | Alle 27 sider, hele dokumentet | Ingen normal vandret overflow, klippede kontroller, manglende h1 eller fejlindlæste billeder i afsluttede sidemålinger. |
| 768/1024/1440 | Alle 27 sider, hele dokumentet | Samme automatiske layoutresultat. Dette dækker ikke brugerændrede tekstafstande eller langsomme billeder. |
| 600/601/640/720 | Forside, Events, Ny her | Ingen normal overflow; overgang mellem synligt mobilnav og kompakt desktopnav fungerer. Ved 601 er logo/link uden vandret mellemrum. |
| 1441/1536/1600 | Samme tre sider | Forsidens overflow starter ved 1441 og vokser; KD-01. |
| 1920 | Samme tre sider | Forside +40 px, Events/Ny her +2 px dokumentbredde; KD-01. |
| 568 px skærmhøjde | Centrale navigationsrejser ved mobilbredder | Links/hero-CTA kan bruges; ingen modal menu eller scroll-lock. |
| 200/400 % native zoom | Seks/syv centrale sider | Ingen vandret overflow i zoomtesten. |
| Øgede tekstafstande, 320/390/768/1440 | Syv centrale sider, 28 kontroller | Afklipning i forsiden ved 320/768/1440; KD-03. |

**KD-08 – verificeret indlæsningsafhængigt layoutskift:** I en frisk browser blev eventcovers midlertidigt forsinket, indtil første kort var i viewporten og fonte klar. Efter frigivelse/decode ved 1440 voksede siden fra **3922 til 4935 px**; første kort voksede fra **327,53 til 422 px**. Registreret CLS var **0,01688**, altså ikke en overskridelse af 0,1. Bevægelsen er stadig synlig ved læsning/scrolning og gør screenshotgeometri afhængig af netværket. Ved 390 var siden stabil på 7699 px. Reservér desktopkortets medie-/rækkeplads før indlæsning i stedet for at lade `height:100%` i et auto-grid afhænge af billedets intrinsiske højde. Bevar `contain` og hele det autentiske cover.

[Kontrolleret billedforsøg](qa/deep-audit-2026-11-10/image-stability.json), [før](qa/deep-audit-2026-11-10/findings/images-pending-1440.png), [efter](qa/deep-audit-2026-11-10/findings/images-decoded-1440.png). Forsøget er en fremprovokeret langsom-netværkstilstand, ikke en påstand om, at alle normale besøg flytter siden 1013 px. Brug de fuldt decodede sidemål i layoutbeskrivelser.

## 13. Performance og teknisk UX

Nye, sekventielle Lighthouse-kørsler mod liveversionen. Mobil 390×844, desktop 1440×900, DPR1. Mobil bruger Lighthouse's simulerede mobilnetværk/CPU, desktop preset. Én måling pr. side/enhed; dette er laboratoriedata, ikke 75-percentil fra besøgende.

| Side | Mobil P / LCP sek. | Desktop P / LCP sek. | CLS mobil / desktop |
| --- | --- | --- | --- |
| Forside | 94 / 3,030 | 100 / 0,337 | 0 / 0,01076 |
| Events | 100 / 1,844 | 99 / 0,919 | 0 / 0 |
| Kalender | 100 / 0,969 | 100 / 0,734 | 0 / 0 |
| Om | 100 / 1,741 | 100 / 0,736 | 0 / 0 |
| Ny her | 95 / 2,961 | 100 / 0,743 | 0 / 0 |
| Kontakt | 99 / 1,963 | 100 / 0,730 | 0 / 0,00452 |
| Tokyo-detalje | 100 / 0,869 | 99 / 0,889 | 0 / 0 |
| AI skillsharing-detalje | 100 / 0,884 | 100 / 0,694 | 0 / 0 |

Accessibility er 100 i alle målinger. Best practices er 96 på desktop Events/Om/Kontakt på grund af heroens billedproportioner (KD-14), ellers 100. SEO er 63 overalt på grund af den bevidste `noindex,nofollow`-beskyttelse (KD-12), ikke manglende sidetitler/beskrivelser.

TBT er **0–47 ms**. Der findes ikke validerede INP-feltdata i dette audit, og TBT er ikke INP. Ingen tredjeparts-HTTP-requests blev registreret i de 16 interne side-loadmålinger; Luma åbnes først via links. De målte loads bruger ca. **186 KB–1,684 MB** og 7–18 requests, afhængigt af side/viewport og browserens lazy-loadadfærd. Tallene er ikke et loft for en fuld scrollsession.

**KD-13 – forbedringsmulighed med målt nytte:** Mobilforside og Ny her har LCP omkring 3 sekunder i denne prøve. På desktop Events hentede det lille Ny her-banner en **ca. 567 KB** original `d2848.webp` til et 354×188 px slot. En mindre autentisk variant findes allerede; brug passende `srcset/sizes`, og vurder komprimering mod en retina-reference. Heroen på samme side henter ca. 488 KB. De to WOFF2-overførsler på forside/Ny her er ca. 205,5 og 89,3 KB. Justér billedvalg først; overvej kun fontsubset, hvis dansk, eksterne navne og alle nødvendige glyffer bevares. Skift ikke familie/akser for at jagte en score.

LCP-billeder findes i HTML med høj prioritet og er ikke lazy. Offscreen billeder er overvejende lazy; carousel bruger større kilder ved retina og pauser uden for viewport. Lighthouse rapporterer ingen større ubrugt JS/CSS-besparelse. Der er ikke belæg for ny frameworkstruktur, Supabase, billedservice eller omfattende JS-refaktorering. CLS i den separate scroll-/billedtest KD-08 skal vurderes ved siden af loadmålingernes lave CLS.

[16 komplette målinger og scoreoversigt](qa/deep-audit-2026-11-10/performance/lighthouse/), [netværk/TBT/LCP-detaljer](qa/deep-audit-2026-11-10/performance/details-summary.json).

## 14. Screenshot-dokumentation

Screenshots viser den **uændrede liveversion** eller en navngiven browser-testtilstand. Der findes ingen implementerede “efter rettelse”-screenshots i dette read-only audit. Pending/decoded er to indlæsningstilstande, ikke to kodeversioner. CSS til tekstafstande er kun en midlertidig brugerindstilling i testbrowseren. Figmaeksporter er referencescreenshots, ikke live.

| Bevis | Filer |
| --- | --- |
| Alle 27 sider × syv bredder | [Fuldscreenshots og pages.json](qa/deep-audit-2026-11-10/pages/) |
| Visuel gennemgang af hovedsider | [390 oversigt](qa/deep-audit-2026-11-10/overview/group-1-390.png), [1440 oversigt](qa/deep-audit-2026-11-10/overview/group-1-1440.png) |
| Alle officielle detaljer | [390](qa/deep-audit-2026-11-10/overview/group-2-390.png), [1440](qa/deep-audit-2026-11-10/overview/group-2-1440.png) |
| Demoer og 404 | [Gruppe 3](qa/deep-audit-2026-11-10/overview/group-3-390.png), [gruppe 4](qa/deep-audit-2026-11-10/overview/group-4-390.png); desktopvarianter ligger samme sted |
| Header/Figma | [Events sammenstilling](qa/deep-audit-2026-11-10/references/figma-live-nav-events.png), [originale referencer](qa/deep-audit-2026-11-10/references/) |
| KD-01 | [1920 px headeroverflow](qa/deep-audit-2026-11-10/findings/header-overflow-home-1920.png) |
| KD-02 | [Play-knap med fokusstop](qa/deep-audit-2026-11-10/findings/carousel-play-focus-1440.png) + JSON med før/efter 10 sek. |
| KD-03 | [Tekstafstande mobil](qa/deep-audit-2026-11-10/findings/text-spacing-hero-320.png), [desktop](qa/deep-audit-2026-11-10/findings/text-spacing-hero-1440.png) |
| KD-04 | [Kontakt hele siden](qa/deep-audit-2026-11-10/pages/_kontakt_-390.png), [demobekræftelse](qa/deep-audit-2026-11-10/interactions/contact-confirmation-390.png) |
| KD-05 | [Kalender første viewport mobil](qa/deep-audit-2026-11-10/findings/calendar-first-viewport-390.png), [desktop](qa/deep-audit-2026-11-10/findings/calendar-first-viewport-1440.png) |
| KD-06/07/09 | [Events hele siden](qa/deep-audit-2026-11-10/pages/_events_-390.png), [tilbage uden filter](qa/deep-audit-2026-11-10/findings/events-context-reset-390.png), browserdata |
| KD-08 | [Billeder forsinket](qa/deep-audit-2026-11-10/findings/images-pending-1440.png), [decodede](qa/deep-audit-2026-11-10/findings/images-decoded-1440.png) |
| KD-16 | [Aktiv mobilnavigation](qa/deep-audit-2026-11-10/findings/nav-active-contrast-320.png) + farveberegning |
| Bestået FAQ | [Åben 390](qa/deep-audit-2026-11-10/interactions/faq-open-390.png), [åben 1440](qa/deep-audit-2026-11-10/interactions/faq-open-1440.png) |

En statisk PNG beviser ikke autoplay eller tastaturadfærd; de tilhørende tidsserier, assertions og fokusaflæsninger er derfor en del af evidensen.

## 15. Prioriteret oversigt over alle fund

**Klasser:** F = verificeret fejl/adfærd, V = UX/UI-vurdering, M = forbedringsmulighed. Kompleksitet S = lokal afgrænset ændring, M = flere tilstande/responsive komponenter, L = integration med større afklaringer. Ingen P0 er identificeret. P1 er høj effekt, P2 mellem, P3 valgfrit polish. En kendt prototypebegrænsning er ikke automatisk en regression.

| ID / prioritet / klasse | Side og komponent; problem og evidens | Konkret løsning og brugerfordel | Kompleksitet / afhængighed | Acceptkriterier til næste implementering |
| --- | --- | --- | --- | --- |
| **KD-01 · P1 · F** | Global header; dokument 1960 px ved 1920, CTA uden for skærmen. Afsnit 5 + ekstra headerbredder. | Lad container, kolonner, gaps og CTA-margin dele en korrekt pladsberegning. Hele navigationen kan ses. Skjul ikke fejlen med body-overflow. | S–M; eksisterende Header/global/pages-regler, ingen ekstern dependency. | Ingen overflow/klippede kontroller ved syv grundbredder samt 1441/1536/1600/1920 og en ny 2560-kontrol. Alle links/CTA'er fortsat synlige. |
| **KD-02 · P1 · F** | Forside carousel; Afspil bliver `paused/focus` i 10 sek., label siger Pause. | Eksplicit Play skal starte faktisk rotation uden at stjæle/fjerne fokus. Bevar beskyttende pausevalg. | S–M; carousel-state og regressionstest. | Mus og tastatur: Pause → Play, behold fokus, flyt pointer væk: to skift ved ca. 4,5/9 sek. Label/state stemmer. Hover, ny fokusindgang, swipe og reduced-motion genprøves. |
| **KD-03 · P1 · F** | Forside hero; tekstafstand-test klipper countdown og eventtekst. Afsnit 11. | Giv indhold og kontroller vækstplads; bevar normal editorial geometri. Brugere med øgede afstande mister ikke indhold. | M; hero/countdown responsive regler. | Samme fire tekstafstande ved 320/390/768/1440: hele countdown, eventtekst og CTA læsbare og betjenelige uden overlap/klip. Standardreference består. |
| **KD-04 · P1 · V, verificeret begrænsning** | Kontakt/footer; kun demo, 0 mailto/tel og ingen rigtig afsendelse. | Tilbyd en ejerbekræftet kontaktkanal. Et tydeligt mail-link kan være nok; rigtig formular kræver en separat aftale. | S for mail-link, M–L for afsendelse; ejerens kanal og evt. samtykke/spam/kvitteringskrav. | Besøgende kan kontakte faktisk modtager via oplyst kanal. Demo må ikke ligne afsendelse. Kun hvis rigtig form vælges: fejl/succes, levering og databehandling verificeres særskilt. |
| **KD-05 · P1 · V** | Kalender; månedsvalg y959/1085 på mobil/desktop. | Flyt kalenderopgaven frem; feature/foto sekundært. Hurtigere datovalg. | M; eksisterende layout, ingen nye eventdata. | Månedsvalg og begyndende gitter ses i første viewport ved 390×844 og 1440×900; alle måneder/detaljelinks/history bevares. |
| **KD-06 · P1 · V** | Events; 1 kommende/7 afsluttede, 7699 px mobilside. | Prioritér kommende og gør arkiv til tydelig sekundær del. Gør resultat/placering lettere at afkode. | M; produktvalg om standard, samme katalog/filtermodel. | Første besøg viser næste reelle event tydeligt. Alle 7 tidligere kan fortsat findes. 12 filterkombinationer, deep links og tomtilstand består. Ingen opdigtede København-events. |
| **KD-16 · P1 · F** | Aktiv headertekst; 4,373:1 bordeaux/salvie på 14/18 px navtekst. | Brug et eksisterende kontraststærkt teksttoken, behold current-understregning. Aktiv side kan læses med mindst 4,5:1. | S; Header-statefarve, ingen paletændring nødvendig. | Alle aktive mobil-/desktoplinks har beregnet ≥4,5:1 på faktisk baggrund. 240 ms hover, fokus og current-state bevares. |
| **KD-07 · P2 · V, verificeret adfærd** | Detaljens tilbage-link nulstiller filtre/måned; 1 resultat bliver 8. | Tilbyd tilbage til den valgte lokale oversigt med valideret type/status/month; direkte indgang falder tilbage til Alle events. Mindre gentaget arbejde. | M; Events, kalender, detaljelinks og sikker lokal retur-URL. | Talk/upcoming → detalje → tilbage giver samme URL/resultat. Decemberkalender kommer tilbage til december. Browser Back og direkte detail-URL virker. Ingen ekstern redirect. |
| **KD-08 · P2 · F** | Desktopkort vokser efter billeddecode; +1013 px samlet, CLS 0,01688 i forsinket test. | Reservér stabil medie-/rækkegeometri med korrekt billeddimensionering. Mindre flytning under læsning. | S–M; EventCard/CSS, prøv portrait/square covers. | Forsink hvert cover, scroll til første række, frigiv: kortenes y/højder er stabile. Hele covers og mobilens nuværende stabilitet bevares. |
| **KD-09 · P2 · M** | Mobilkort giver 16 tabstop til 8 destinationer. | Ét logisk kortlink med bevaret visuel CTA og tydeligt navn. Kortere fokusvej. | S; EventCard, undgå nested links. | 8 logiske eventdestinationer i tabrækkefølgen; hele titler annonceres; foto/titel/CTA fungerer med touch og mus. |
| **KD-10 · P2 · V** | Header ved 1440: V2-links 19 px venstre/3,75 px op mod Figma; CTA flytter 38 px mellem sider. | Ensret optiske nav-/CTA-linjer via eksisterende spacing, respekter dokumenterede header/fontvarianter. Mere ro ved sideskift. | S–M; afstem med KD-01 og Figma-referencer. | Events/Om/Kontakt matcher vedtaget x/y; Ny her-CTA-valg dokumenteres. Ingen logo-/CTA-klip eller nye rasteriterationsloops. |
| **KD-11 · P2 · M** | Tokyo kræver JP¥1000 og godkendelse på Luma; lokale fakta henviser alene videre. Katalog er manuelt. | Vis verificeret pris/godkendelseskrav nær CTA og aftal en enkel opdateringsrutine inkl. kildekonflikter. Færre overraskelser ved handoff. | S–M; aktuelle Luma-oplysninger/ejerbekræftelse, ingen bookingintegration nødvendig. | Pris/krav stemmer med officiel kilde og har kontroltidspunkt. Ingen løfte om reserveret plads. Efter udløb tilbydes kun korrekte muligheder; nye data indføres kun med kilde. |
| **KD-12 · P2 · M, lanceringsvalg** | 12 demo-HTML-ruter er offentlige; alle sider er noindex og SEO63. | Beslut preview-/produktionsafgrænsning og en kontrolleret indekseringspolitik. Beskyt mod at demoer bliver virkelige tilbud. | M; ejerens go-live-beslutning, KD-04 og eventdata først. | Godkendte produktionsruter kan indekseres, hvis det ønskes; demoer forbliver tydeligt isolerede/noindex. Historik/dokumentation bevares. Ingen global ukritisk fjernelse af noindex. |
| **KD-13 · P2 · M** | Forside/Ny her mobil-LCP 3,03/2,96 sek.; Events-banner henter 567 KB ved 354×188. | Brug eksisterende mindre fotovarianter og korrekte responsive slots, komprimér kun med billed-QA. Mindre trafik og bedre mobiloplevelse. | S–M; originale autentiske filer og retina-sammenligning. | Banner ved DPR1 henter passende mindre variant; DPR2 er skarp. Gentag 3 sekventielle mobile målinger og sammenlign median/bytes, sigt efter LCP≤2,5 sek. uden font-/motivregression. |
| **KD-14 · P2 · M, verificeret teknisk afvigelse** | V2-heroens aspect-ratio er strakt; BP96 på tre desktopsider. | Afprøv proportional beskæring med samme motiv/foto og dokumentér referencevalget. Mere naturlige personer. | S–M; visuelt tradeoff mod eksisterende Figma-beskæring skal vurderes. | Ingen anisotrop forvrængning, læsbar hero og godkendt motivplacering ved 390/768/1440; ingen udskiftning af autentisk billede. |
| **KD-15 · P3 · M** | Forsidens to afsnitsgrupper gentager idéer/forbindelser. Ekspertvurdering, intet målt frafald. | Kondensér introduktion og giv næste tekst én konkret deltagervinkel. Hurtigere læsning uden ændret identitet. | S; ejerredigering, ingen nye faktapåstande. | Hver tekstblok har en særskilt opgave; formål, imødekommenhed, foto og event-CTA bevares. Ingen sektionssletning uden tydelig gevinst. |

## 16. Implementeringsplan

Denne plan er en anbefaling til en **senere implementeringsopgave**. Den er ikke udført eller godkendt som en ny deployment.

1. **Batch A – afgrænsede funktionelle/a11y-rettelser:** KD-01, KD-02 og KD-16. De har høj effekt og begrænset lokal kompleksitet. Udvid carouseltesten med fokusbevarende Play og layoutmatricen med bred desktop. Ret kontrast med eksisterende token. Kør relevante browserflows og screenshots før næste batch.
2. **Batch B – tilpasning og stabile medier:** KD-03 og KD-08, derefter KD-10 i samme header-/layoutreview. Standard-Figma, tekstafstande, zoom og forsinkede billeder skal alle fungere samtidig. Undgå at “rette” klipning med global overflow-hidden.
3. **Batch C – Events-opgaven:** KD-05/06/07/09. Beslut kommende/arkiv og placér kalenderen fremme; bevar retur-kontekst og reducer dublerede mobilstop. Verificér 12 kombinationer, måneder, direkte detailindgang, browserhistorik og Luma-overgang samlet.
4. **Batch D – faktisk kundeklarhed:** Afklar KD-04 og KD-11 med ejer. Brug den enkleste verificerbare kontaktløsning; vedligehold Luma-fakta og få kildekonflikter afklaret. Beslut derefter KD-12, herunder om dette site fortsat er en undervisningsprototype. En rigtig kontaktintegration testes separat; demoens nuværende feedback må ikke genbruges som bevis for levering.
5. **Batch E – målrettet visuel/performanceforbedring:** KD-13 og KD-14. Samme fotos, bedre størrelse/proportioner, mindst tre sammenlignelige mobilmålinger, retina-QA og referencekontrol. KD-15 er sidst og kan helt undlades, hvis redigeringen ikke forbedrer læsningen.
6. **Afsluttende gate:** Astro production build og statiske checks, relevante Playwright-flows, nye fokus-/tekstafstand-/breddetests og screenshots ved alle syv bredder. Manual VoiceOver/NVDA samt Safari/Firefox og en fysisk mobil bør indgå før en kundelancering. Push/deployment kræver den særskilte autorisation, som en fremtidig opgave giver; der er intet udgivelsesarbejde i denne audit.

Foreslået efterfølgende brugertest, **ikke udført her**: Lad 3–5 relevante førstegangs-/tilbagevendende besøgende finde et kommende event i relevant by, filtrere/åbne/vende tilbage, afkode pris/godkendelse og finde en kontaktvej. Registrér faktisk tid, fejl og forventninger; opfind ikke svar eller succesprocenter. Efterprøv kalenderens værdi før en større omlægning.

## 17. Hvad der bør bevares

- Creme/sand, bordeaux, salvie og lyseblå samt de eksisterende fontfamilier og optiske størrelser.
- Autentiske communityfotos, officielle covers og den editorial komposition. Mere komprimering er kun acceptabel med visuel kontrol.
- De synlige fire mobilvalg, logoets forsidevej, skip-link, almindelig linknavigation og den grundlæggende informationsarkitektur.
- Den rolige 240 ms underline uden layoutskift; vedvarende active-state og tydeligt fokus. Ret kun den utilstrækkelige aktive tekstkontrast.
- FAQ'ens tre spørgsmål, tastaturadfærd, én åben ad gangen og no-JS-svar.
- Carouselens centralkort, nabokort, glasramme, loop, touch og reduced-motion; løs kun de konkrete states frem for at genimplementere komponenten.
- Faktiske eventdatoer/byer/tidszoner, synlige kildeforbehold, direkte Luma-links, udløbsbeskyttelse og historikken over afsluttede events.
- Ærlige demo-/prototypebeskeder, så længe funktionerne ikke har rigtig afsendelse/reservation.
- Astro og den lille lokale JS-overflade. Ingen data i auditten begrunder nyt backendlag eller frameworkskifte.

## 18. Testbegrænsninger

- Chrome/Playwright og native Chrome på denne Mac; ikke Safari, Firefox, en fysisk telefon eller en rigtig skærmlæser med oplæsning. CDP-touch er browseremulation.
- Ingen repræsentativ brugerstudie, analytics, felt-INP, CrUX-validering eller konverteringsmåling. Designvurderinger er begrundede hypoteser, ikke dokumenteret brugereffekt.
- Lighthouse har én ny sekventiel kørsel pr. side/device. Netværk/CPU og laboratoriemodel giver variation. Der er ikke grundlag for at kalde 94 kontra 95 en regression.
- Alle sider er scroll-/screenshotdækket, men ikke alle mulige kombinationer af input, sprog, højder og hjælpemidler. De 12 faktisk understøttede filterkombinationer er kontrolleret; der findes ingen geografisk filterfunktion at bestå/fejle.
- Automatiske a11y-tests er ikke en fuld konformitetsaudit. Incomplete kontrast, fotos, fokus under alle browser-/OS-varianter og hele skærmlæseroplevelsen kræver mere manuel test.
- Friske Figma-data vedrører især navigationen. Der er ikke udført en ny numerisk fuldside-diff mod enhver Figma-frame ved alle syv bredder; 768 og flere mellembredder har ikke særskilte godkendte frames. Der er derfor ingen udokumenteret påstand om fuld 1:1-pixelidentitet.
- Luma er læst uden booking, betaling, kontoændring eller kontakt til arrangør. Pris/krav kan ændres. Historiske kildekonflikter er ikke afgjort ved gæt.
- Founderbiografier, ejerkontakt og billedsamtykker er ikke genbekræftet gennem ekstern kontakt. Ingen deltageroplysninger fra Luma er gemt som auditevidens.
- Native zoom er dokumenteret med aflæsninger og den observerede browser-UI; der er ikke gemt et separat filesystem-screenshot af zoommenuen.
- Ingen rettelser er forsøgt. Acceptkriterierne er fremtidige tests, ikke allerede beståede implementeringsresultater.

## 19. Konklusion

Auditen er gennemført som analyse, test og lokal dokumentation. Den publicerede autoplayrettelse og FAQ er til stede; de skal ikke genimplementeres. De vigtigste næste handlinger er den brede headers pladsberegning, eksplicit Play, aktiv navkontrast og heroens tilpasning til tekstafstande. Derefter bør Events/kalenderens prioritering, retur-kontekst og den faktiske kontaktvej løftes.

Den eksisterende identitet og hovednavigation er et godt grundlag. Et mindre antal målrettede rettelser og tydelige lanceringsvalg giver mere værdi end flere effekter eller et generisk redesign. **Applikationskode og eksterne systemer er uændrede.**
