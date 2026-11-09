# KindDesign

Statisk Astro-website baseret på KindDesigns aktive Figma-prototype. Forside, carousel, Events og filtre, kalender, fire eventdetaljer, Om KindDesign, Ny her, Kontakt og lokale tilmeldings-/kalenderdemoer er implementeret.

**Status:** Lokal implementering og QA for fase 2–6. Eventindhold er Figma-eksempeldata; kontakt sender intet. Rigtige Luma-links og ekstern Netlify-hosting er ikke aktiveret. Supabase er vurderet og fravalgt, da ingen relevant backendfunktion er dokumenteret.

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

- `src/pages/`: 19 statiske sider inklusive 404 og genererede event-/demoruter.
- `src/components/`, `src/layouts/`: fælles navigation, kort, hero, carousel og sidelayouts.
- `src/data/events.js`: fire dokumenterede Figma-eksempel-events og valgfri Luma-konfiguration.
- `src/scripts/`: Vanilla JavaScript til carousel, filtre og kontaktvalidering.
- `public/`: autentiske, optimerede billeder og lokale WOFF2-fonte med licenser.
- `docs/source-assets/`, `docs/source-fonts/`: bevarede originaler.
- `docs/qa/`: screenshots, overlays, browser- og Lighthouse-resultater.

[Samlet rapport](docs/fase-2-6-rapport.md) · [Teknisk dokumentation](docs/dokumentation.md) · [Fase 1-reference](docs/fase-1-rapport.md)

`netlify.toml` er lokalt verificeret med offline-build. Ingen push, merge eller deployment er foretaget. Previewet har fortsat `noindex, nofollow`. Miljøvariabler i `.env.example` er valgfrie offentlige eventadresser, ikke credentials.

[Figma](https://www.figma.com/design/upaKrrIg3bRBgo4Md8s12F/Prototype---Tema-9?node-id=753-846) · [GitHub](https://github.com/Holdet-EK-2026/tema-09)
