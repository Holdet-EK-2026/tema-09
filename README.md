# KindDesign · Fase 1

Astro-forside baseret på de aktive Figma-frames. Kun fase 1 er implementeret.

**Status: Afsluttende fase 1-QA er gennemført. Fontafvigelsen er rettet, og hele mobil- og desktopsiden er sammenlignet. Mindre rasterforskelle og manglende tabletframe er dokumenteret i rapporten.**

## Kør lokalt

Brug Node **22.23.4 eller nyere**. Med nvm: `nvm install` og `nvm use`.

```sh
npm ci
npm run dev
```

Åbn adressen, som Astro viser. Den byggede udgave kan kontrolleres med:

```sh
npm run build
npm run preview
```

Scripts kalder Astro gennem Node direkte. Det understøtter projektets overordnede mappe `T09 UX:UI II`, hvor kolon ellers opdeler npm-programmernes PATH.

## Indhold

- `src/components/`: navigation, hero, statisk billedgalleri, community og footer.
- `src/layouts/BaseLayout.astro`: dokument, metadata, CSS og dialog til kommende sider.
- `src/pages/index.astro`: samler forsiden.
- `src/styles/global.css`: designvariabler, layout og responsivitet.
- `src/scripts/navigation.js`: åbner forklaring om kommende sider.
- `public/images/`: optimerede, lokale Figma-assets.
- `public/fonts/`: Bricolage Grotesque og DM Sans med OFL-licenser.
- `docs/source-assets/`: de oprindelige Figma-eksporter, bevaret uden billedændringer.
- `docs/dokumentation.md`: faglig dokumentation og kodegennemgang.
- `docs/fase-1-rapport.md`: resultater, screenshots og resterende afvigelser.

## Afgrænsning

Carouselens pile er statisk grafik i denne fase; galleriet kan rulles vandret med browserens almindelige scroll. Nedtælling og eventdato er Figma-eksempeldata. Links til øvrige sider åbner en forklaring, da siderne først bygges i fase 3. Ingen database, automatisk carousel, eventtilmelding eller offentlig hosting er oprettet.

`netlify.toml` angiver buildkommando, `dist` og Node-version. Ingen Netlify-integration er aktiveret. Previewet har `noindex, nofollow`; dette skal vurderes før en senere offentlig lancering.

GitHub-repositoryet var tomt ved kontrollen 9. november 2026. Arbejdet ligger på den lokale branch `feature/fase-1-forside`. Ingen ændringer på `main`, push, merge eller deployment.

[Figma](https://www.figma.com/design/upaKrrIg3bRBgo4Md8s12F/Prototype---Tema-9?node-id=753-847) · [GitHub](https://github.com/Holdet-EK-2026/tema-09)
