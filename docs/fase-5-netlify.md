# Fase 5 – lokal Netlify-klargøring

## Implementeret og verificeret lokalt

`netlify.toml` bruger `npm run build && npm test`, output `dist` og Node 22.23.4. Deploy Preview og branch-deploy anvender samme checks. Der er ikke behov for en Netlify-adapter, da løsningen er statisk. Der er ingen Netlify Functions, Forms eller databaseintegration.

Konfigurationen tilføjer `nosniff`, en restriktiv referrer-policy og lang browsercache for Astro-filer med indholdshash. Der er ingen SPA-rewrite: hver underside har sin egen byggede HTML-fil. En fallback af alle adresser til forsiden ville skjule manglende ruter og er ikke anvendt.

Netlify-konfigurationsskillen og Netlifys coding-context blev læst før ændringerne. Den officielle `netlify-cli` 27.16.3 er installeret isoleret under `/tmp/kinddesign-netlify-cli`, ikke som applikationsdependency. Kommandoen er en lokal build, ikke en deploy:

```sh
netlify build --offline --context deploy-preview
```

Se `docs/qa/fase-5/netlify-offline-build.log` og `config-check.json`. TOML-parsing og buildværdier er kontrolleret. Offline-builden bestod: Netlify CLI kørte `npm run build && npm test`, byggede 18 sider og bestod kontrollen af interne links, ankre og assets. Første forsøg blev stoppet af sandboxens filadgang til CLI-præferencer; samme offline-kommando bestod med den nødvendige lokale filadgang. Ingen netværksfunktion eller deployment blev aktiveret.

## Miljøvariabler

`.env.example` indeholder kun fire tomme, valgfrie `PUBLIC_LUMA_*_URL`-værdier. De er offentlige eventadresser, ikke nøgler. Kun HTTPS-adresser til de tilladte Luma-domæner med en eventsti accepteres; uden konfiguration bevares Figma-demoflowet. En adresse skal matche et faktisk godkendt event, før den bruges.

Ingen Supabase-, service-role-, secret- eller API-nøgler er nødvendige. `.env` og øvrige lokale miljøfiler er fortsat ignoreret. `.netlify` er også ignoreret. Fremtidige secrets skal opbevares i Netlifys sikre miljøvariabler og aldrig under et `PUBLIC_`-navn.

## Status for ekstern hosting

**Ingen GitHub-push, repository-forbindelse, ekstern Deploy Preview, merge eller produktionsdeployment er udført.** Denne opgave autoriserer fortsat lokale, reversible ændringer og forbyder produktion uden særskilt godkendelse. Offline-builden er ikke et bevis på en afprøvet Netlify-hostet side.

Der mangler en valgt Netlify-site-/repository-forbindelse og en godkendt publiceringshandling, før et rigtigt preview kan oprettes. Efter en senere godkendelse skal en Deploy Preview kontrolleres med rigtige miljøværdier, dybe links, 404, cache og responseheaders. Før produktion skal de dokumenterede eksempeldata og eventlinks erstattes af godkendt indhold.

Siderne beholder `noindex, nofollow`. Dette beskytter en ufærdig prototype mod indeksering og begrænser med vilje Lighthouse SEO-scoren. Indeksering, canonical-domæne og sitemap skal først aktiveres, når det rigtige domæne og publicering er besluttet. Ingen fiktiv canonical-URL er tilføjet.

## Afsluttende regression i fase 6

Efter optimeringerne er samme offline-build gentaget med succes på 19 sider inklusive 404. Log: [fase 6 Netlify-build](qa/fase-6/netlify-offline-build.log). De statiske checks består fortsat. Ingen ekstern hosting er aktiveret.

## Ny slutopgave: Luma og kalenderfiler

Den efterfølgende carousel-/Luma-version bygger 27 HTML-sider og en ICS-fil. Netlify-konfigurationen tilføjer `text/calendar` og attachment for kalenderfiler. Miljø-overrides til demo-events er fjernet til fordel for verificerede kildeposter. Den nye offline-log og øvrige resultater findes i [slutrapporten](final-implementation-rapport.md). Ingen ekstern hosting er aktiveret.
