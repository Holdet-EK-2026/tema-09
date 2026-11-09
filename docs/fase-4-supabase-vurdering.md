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
