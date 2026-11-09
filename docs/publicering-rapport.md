# Publicering på GitHub og Netlify

10. november 2026. Brugerens særskilte instruktion om upload og Netlify-publicering erstatter den tidligere afgrænsning til lokale ændringer for denne handling.

## Publiceret version

- [GitHub-repository](https://github.com/Holdet-EK-2026/tema-09): den tidligere tomme remote har nu `main` og `feature/fase-2-6`. Begge indeholder implementeringen og fjernelsen af carouselens kontrolrække. Der er ikke udført merge eller force-push.
- [Offentlig side](https://kinddesign-holdet-ek-2026.netlify.app).
- Netlify-projekt: `kinddesign-holdet-ek-2026`, id `8cae5019-b5f0-4a43-b9d3-3d33e9363d5e`.
- [Verificeret deployment](https://app.netlify.com/sites/8cae5019-b5f0-4a43-b9d3-3d33e9363d5e/deploys/6af2596b83942c9725b7d4ef): `ready`, production, bygget fra kodecommit `b74463182363cd48e6fa91064eae4e6f17ac7f05`.
- Den lokale, testede `dist` er uploadet med officiel Netlify CLI 27.16.3. Ingen cloud-build eller automatisk GitHub-deployment påstås.
- Netlifys automatisk tilføjede »Powered by Netlify«-badge er slået fra i projektets indstilling, så det godkendte layout bevares. Det kræver ingen ændring af kildekoden eller abonnementet.

## Verifikation

`npm run build` og `npm test` bestod før upload: 27 HTML-sider og en ICS-fil samt interne links, ankre, assets og Luma-/kalenderkonfiguration.

Den offentlige HTTPS-side er testet i Chrome/Playwright ved 390, 768 og 1440 px. Forside, Events, eventkalender, Tokyo-eventdetaljer, Ny her, Om KindDesign og Kontakt returnerer HTTP 200 og har ét h1. Ingen vandret overflow eller JavaScript-undtagelser blev observeret. Forsidens billeder blev hentet og afkodet korrekt.

Carouselens synlige kontrolrække er væk. Piletastnavigation, mellemrumspause og reduced-motion er kontrolleret. Forsidens CTA fører til Events; kommende-filteret viser ét event, og eventdetaljerne linker til `https://luma.com/cmapoye1`. Ingen booking eller kontaktbesked blev sendt. ICS-download returnerer `text/calendar` og den verificerede UTC-starttid. Ukendt rute returnerer den egne 404-side med HTTP 404. `nosniff` og referrer-policy er kontrolleret på den offentlige response.

Evidens: [maskinresultater](qa/publicering/resultater.json), [390 px](qa/publicering/forside-390.png), [768 px](qa/publicering/forside-768.png), [1440 px](qa/publicering/forside-1440.png). Screenshots er taget fra den offentlige side; tidligere Figma- og fulde Lighthouse-resultater er bevaret i de tidligere rapporter. Lighthouse er ikke gentaget som del af denne upload.

## Automatisk deployment og kendte afgrænsninger

Netlify-CLIens GitHub-kobling kunne ikke oprettes. Den gemte GitHub-forbindelse havde ikke den nødvendige repository-adgang; den fungerende GitHub-adgang viste derefter, at organisationen blokerer deploy keys (`Deploy keys are disabled for this repository`). Der er ingen Netlify GitHub App installeret på organisationen. Ingen organisationspolitikker eller adgangsrettigheder blev ændret, og intet GitHub-webhook blev oprettet. Den kendte, ubrugte Netlify-nøgle fra det efterfølgende forsøg er slettet.

**Push til `main` udløser derfor endnu ikke Netlify-publicering.** Fremtidige versioner kan bygges, testes og publiceres direkte via den tilknyttede CLI. For automatisk deployment skal en autoriseret ejer forbinde Netlify GitHub App med det konkrete repository og vælge `main`, buildkommando `npm run build && npm test`, publish-mappe `dist` og Node 22.23.4. Organisationens politik behøver ikke lempes for en appbaseret forbindelse. Første cloud-build skal derefter verificeres særskilt.

Prototypens `noindex, nofollow`, lokale kontakt-/medlemsdemoer, manuelt verificerede eventkatalog og dokumenterede Supabase-udestående er bevaret. Publicering gør ikke demofunktioner til en backend. Intet produktionsdatasystem er ændret. Det eksterne eventkatalog skal fortsat vedligeholdes og genbygges, når status/indhold ændres.
