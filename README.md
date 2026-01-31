# CZ/SK Rust Pohoda — Static web (Cloudflare Pages)

## Rýchly deploy (Cloudflare Pages)
1. Vytvor GitHub repo a nahraj obsah tohto priečinka.
2. Cloudflare Pages → Create project → vyber repo
3. **Framework preset:** None
4. **Build command:** (prázdne)
5. **Output directory:** `/` (root)
6. Deploy.

## Ako upravovať obsah (bez programovania)
- Texty meníš v `content/*.md`
- Server údaje meníš v `config.json`

## Galéria (screenshoty)
1. Nahraj obrázky do `public/gallery/` (png/jpg/webp/svg)
2. Doplň ich do `public/gallery/manifest.json` (súbor + názov + popis)

Poznámka: pri čisto statickom hostingu nie je možné automaticky "vypísať" obsah priečinka bez manifestu.


## Jazyk (SK/CZ prepínač)
Obsah je v `content/*.sk.md` a `content/*.cz.md`.
Jazyk prepneš tlačidlami SK/CZ v hornej lište (uloží sa do localStorage).

## BattleMetrics status (voliteľné)
Do `config.json` doplň:
- `battlemetricsServerId`: napr. `12345678`
Potom sa na home zobrazí embed.


## Promo banner + Top rules + Donate
V `config.json` môžeš upraviť:
- `promoEnabled`, `promoText_sk`, `promoText_cz`
- `topRules_sk`, `topRules_cz` (zobrazí sa na home ako highlight)
- `donateUrl` (Tebex / donate link) + `donateLabel` (text)


## Tebex v review (Coming soon režim)
Kým je Tebex store v schvaľovaní nastav v `config.json`:
- `"donateComingSoon": true`
- `"donateUrl": ""` (prázdne)
Na webe sa zobrazí tlačidlo Podpora a po kliknutí vyskočí okno s informáciou + Discord kontakt.

Po schválení:
- `"donateComingSoon": false`
- `"donateUrl": "https://tvojserver.tebex.io"`


## Donate modal – Copy IP & Connect
V okne Podpora sú aj tlačidlá:
- **COPY IP** – skopíruje IP servera
- **CONNECT** – otvorí Rust priamo (steam://connect)


## Wipe odpočet + auto-banner
Na home sa zobrazuje odpočet do najbližšieho wipe (počítané v časovej zóne Europe/Bratislava).
Ak je wipe **v ten istý deň**, promo banner sa automaticky prepne na „WIPE DNES 20:00“.
