# Batch A – KD-01, KD-02, KD-16

Lokal production build, server port 4323. 70 header-/kontrastkontroller på fem sider ved 14 bredder (320–2560) består. Ingen dokument-overflow, skjult CTA eller logooverlap. Aktiv tekst bruger `--tekst` og mindst 8,20:1 på salvie.

Carouselpakken består ved 390/768/1440: to reelle automatiske skift uden input og to efter eksplicit Play med fokus bevaret. Keyboard Play/Pause, ny fokusindgang, hover, loop, touch, reduced-motion og cleanup består. `carousel.json` indeholder faktisk timing. Pointerens udgang beregnes fra det aktuelle viewportrektangel; en fast skærmposition var ikke uden for billederne efter browserens scroll-til-knap på tablet. Fokus fjernes ikke i den nye Play-regression.

Headerreferencer og screenshots er gemt her. Batch B følger med tekstafstande, medieplads og vertikal headeralignment. De eksisterende scripts accepterer nu `KINDDESIGN_QA_BASE`, så den nye production build kan testes isoleret fra det tidligere preview.
