# KindDesign

Statisk Astro-website baseret på KindDesigns aktive Figma-prototype. Forside, carousel, Events og filtre, kalender, otte officielle eventdetaljer og fire tydelige demoer, Om KindDesign, Ny her, Kontakt og lokale tilmeldings-/kalenderdemoer er implementeret.

**Status:** Premium 3D/glass-carousel og et manuelt verificeret Luma-katalog med ét kommende og syv tidligere events pr. 9. november 2026. Tilmelding til det kommende Tokyo-event går direkte til Luma. Kontakt sender intet. Supabase-CRUD er fortsat et obligatorisk, uopfyldt læringsmål, som mangler projektadgang og credentials. Ekstern hosting er ikke aktiveret.

## Kør lokalt

Node **22.23.4 eller nyere**. Med nvm: `nvm install` og `nvm use`.

```sh
npm ci
npm run dev
```

Byg og kontrollér:

```sh
npm run build
npm test
npm run preview
```

Kun Astro er direkte applikationsdependency. Scripts kalder Astro via Node, så mappenavnet `T09 UX:UI II` understøttes. Browser-/Lighthouse-setup og testkommandoer findes i [dokumentationen](docs/dokumentation.md).

## Projekt

- `src/pages/`: 27 statiske sider og en ICS-kalenderfil inklusive 404 og genererede event-/demoruter.
- `src/components/`, `src/layouts/`: fælles navigation, kort, hero, carousel og sidelayouts.
- `src/data/events.js`: officielle Luma-events fra `luma-events.js`, lokale tidszoner og separate Figma-demoer.
- `src/scripts/`: Vanilla JavaScript til carousel, filtre og kontaktvalidering.
- `public/`: autentiske, optimerede billeder og lokale WOFF2-fonte med licenser.
- `docs/source-assets/`, `docs/source-fonts/`: bevarede originaler.
- `docs/qa/`: screenshots, overlays, browser- og Lighthouse-resultater.

[Afsluttende carousel-/Luma-rapport](docs/final-implementation-rapport.md) · [Fase 2–6-historik](docs/fase-2-6-rapport.md) · [Teknisk dokumentation](docs/dokumentation.md) · [Fase 1-reference](docs/fase-1-rapport.md)

`netlify.toml` er lokalt verificeret med offline-build. Ingen push, merge eller deployment er foretaget. Previewet har fortsat `noindex, nofollow`. Det lokale eventkatalog kræver ingen API-nøgler. Se `.env.example` og dokumentationen.

[Figma](https://www.figma.com/design/upaKrrIg3bRBgo4Md8s12F/Prototype---Tema-9?node-id=753-846) · [GitHub](https://github.com/Holdet-EK-2026/tema-09)
