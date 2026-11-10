# Batch E – KD-13, KD-14

30 billedkontroller består: fem sider × 390/768/1440 × DPR1/DPR2. Større kilder vælges på retina, covers/motiver er autentiske, og V2-heroer bruger proportional cover-beskæring med `object-position:center 35%`. Før-/efter-sammenstillingen er visuelt gennemgået; ansigtsproportioner er mere naturlige, og kompositionen er bevaret.

Events-bannerets kilde går fra 566.928 bytes til 38.304 ved DPR1 og 115.540 ved DPR2. Varianterne bevarer hele portrætfotoets proportion; CSS bestemmer beskæringen på hvert layout. DPR2-udsnittene er sammenlignet visuelt. Originalfotos/fonte er hashkontrolleret uændrede. En større lossless-logo-variant blev afvist; den eksisterende 248 px kilde bevares til retina.

Tre sekventielle sammenlignelige målinger før/efter pr. scenarie, lokal production build, samme Lighthouse/Chrome og simuleret netværk/CPU. Median:

| Scenarie | Performance før → efter | LCP før → efter |
| --- | --- | --- |
| Forside mobil | 87 → 90 | 4,128 → 3,677 s |
| Ny her mobil | 88 → 91 | 3,903 → 3,527 s |
| Events desktop | 97 → 99 | 1,284 → 0,942 s |

Tallene gælder den samlede raffinerede version: Events viser også kommende som standard. Hele byte-/LCP-gevinsten må derfor ikke tilskrives billedencoding alene. Mobil-LCP er forbedret, men endnu over 2,5 s. Ingen felt-INP eller garanti på alle enheder. `../performance-comparison.json` indeholder medians; rå målinger ligger i before/after/performance.
