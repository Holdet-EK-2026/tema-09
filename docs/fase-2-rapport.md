# Fase 2 – carousel

Implementeret med Vanilla JavaScript og eksisterende autentiske Figma-assets. Desktopkortene skifter mellem de aflæste Figma-positioner; mobil anvender vandret scroll og en skjult tilgængelighedsmæssig kopi til overgangen fra sidste til første kort. Pile, tastatur, swipe, automatisk skift hvert sjette sekund og pauseknap er tilføjet. Hover, fokus, berøring, skjult fane og reduced-motion standser automatisk skift. Ingen carousel-dependency er installeret.

`src/scripts/carousel.js` holder et aktivt indeks og beregner næste indeks med modulo. Et array indeholder de seks Figma-positioner. CSS animerer transform og størrelse. Wrap-kortet flyttes uden synligt tværgående hop. På mobil forbinder en kopi af første kort sidste og første position; efter scroll nulstilles positionen uden animation. Status annonceres kun ved manuel navigation.

Build består. Playwright har testet manuel navigation, et fuldt loop og reduced-motion ved 390, 768 og 1440 px, uden JavaScript-fejl eller sideoverflow. Resultater og screenshots ligger i `docs/qa/fase-2`. Udgangspunktets statiske desktopkomposition er bevaret; pausekontrol og mobilpile er nødvendige interaktionstilføjelser.

Den omtalte referencevideo er ikke tilgængelig blandt projektfilerne. Bevægelsen bygger derfor på Figma-positionerne og den skriftlige bevægelsesbeskrivelse; videopræcis timing kan ikke hævdes. Kvaliteten videreføres til samlet QA i fase 6.
