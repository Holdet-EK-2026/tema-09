# Fase 4 – vurdering af Supabase

## Beslutning efter den seneste opgaveinstruktion

**Ingen Supabase-integration aktiveres i denne version.** Den aktuelle instruktion kræver kun Supabase, når funktionen både er dokumenteret og relevant, og forbyder unødvendig backend. Den tidligere generelle idé om et CRUD-indholdsmodul er ikke en konkret besluttet funktion.

| Kandidat | Dokumenteret adfærd | Vurdering |
| --- | --- | --- |
| Events | Figma-eksempelprogram og statiske demoflows | Ingen dokumenteret redaktørrolle eller indholdsworkflow; lokalt datamodul er tilstrækkeligt |
| Tilmeldinger | Interne demoframes; ingen reservation eller dataafsendelse | Supabase ville modsige demoens løfte og kan senere duplikere Luma |
| Kontakt | »PROTOTYPE · Intet sendes« | Beskeder må ikke persisteres i denne version |
| Medlemskort | Udtrykkeligt koncept i prototypen | Login, medlemsdata og admin-CRUD er ikke dokumenterede flows |
| Founderportrætter | Afventer brugstilladelse | En database løser ikke den manglende brugsret |

Der er derfor ikke oprettet projekt, tabeller, SQL-migrationer, brugere, RLS-policies eller API-nøgler. Ingen eksisterende Supabase-konto eller produktionsdatabase er læst eller ændret. Ingen credentials er nødvendige eller tilføjet.

## Læringsmålets status

Det oprindelige læringsmål om praktisk SQL, relationer, CRUD og RLS er **ikke gennemført**. Vurderingen må ikke omtales som en implementeret database eller som beståede databaserelaterede tests.

En senere konkret databaseopgave kræver dokumentation af dataejerskab, redaktørbehov, datamodel og autorisation. Et eventuelt indholdsmodul skal have RLS aktiveret og kun give offentlige besøgende den nødvendige læseadgang. Opret/opdatér/slet skal kræve autorisation; service-role-/secret-nøgler må aldrig udleveres til frontend. Ingen sådan funktion er tilføjet på et hypotetisk grundlag.

## Verifikation

Kodebasen bruger ingen Supabase-SDK, nøgler eller endpoints. Kontaktens flowtest bekræfter ingen POST og ingen localStorage-skrivning. Uden JavaScript er submit deaktiveret. Eventtilmeldinger følger Figma-demoflowet, indtil dokumenterede Luma-links er konfigureret.

Dette er en bevidst afgrænsning ud fra den seneste instruktion, ikke en teknisk databaseimplementering.


## Fornyet vurdering efter slutopgaven

Den oprindelige kodningsprompt betegner Supabase, SQL, API-kald og CRUD som obligatoriske læringsmål. Den tidligere vurdering afveg fra dette efter den daværende instruktion om at undgå udokumenteret backend. Den nye slutopgave beder om en eksplicit afklaring: **CRUD-læringsmålet er obligatorisk i den oprindelige opgave og stadig ikke opfyldt.**

En minimal relevant funktion er administration af det verificerede eventkatalog: en redaktør opretter en eventkilde, læser kataloget, retter dato/sted/link efter kildekontrol og sletter en fejlregistrering. Dataene er titel, officiel Luma-URL, UTC-start/-slut, IANA-tidszone, offentligt sted, coverkilde, verificeringsdato og publiceringsstatus. Det ville understøtte det reelle vedligeholdelsesbehov, som nu er dokumenteret. Bookinger skal fortsat ske hos Luma; kontakt og medlemsprofiler indgår ikke.

En read-only kontrol af Supabase-connectorens projektliste identificerede intet KindDesign-projekt. Det tilgængelige generisk navngivne projekt var inaktivt og kunne ikke sikkert knyttes til opgaven; det er ikke gendannet, undersøgt i databasen eller ændret. Der er derfor ikke identificeret en KindDesign-testdatabase eller besluttet redaktørautorisation til integrationen. Ingen credentials er hentet. Den faktiske CRUD-integration er derfor blokeret af eksterne oplysninger/adgang. Ingen projektoprettelse eller databaseændring er udført, og der er ikke tilføjet spekulativ Auth eller en usikker offentlig skriveadgang. Et senere modul skal afprøve SQL/CRUD mod en testdatabase med RLS, offentlig læsning af publicerede felter og beskyttet redigering. Den lokale, manuelt verificerede datastruktur demonstrerer ikke database-CRUD og må ikke præsenteres som dette.
