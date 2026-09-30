# Panjandrum – rendezvénytechnikai bemutatóoldal

A [panjandrum.hu](https://panjandrum.hu) (hang- és fénytechnika, színpad- és kordonkivitelezés, Tata) statikus marketingoldalának forráskódja. Astro 5 + Tailwind CSS 4; az egyetlen kliensoldali réteg az Alpine.js (fülválasztó, lightbox, görgetés-alapú animációk).

- **Élő oldal:** <https://panjandrum.hu>
- **Kimenet:** teljesen statikus build, backend és űrlap nélkül

## Tech stack

- **Keretrendszer:** [Astro 5](https://astro.build), TypeScript (`astro/tsconfigs/strict`)
- **Stílus:** [Tailwind CSS 4](https://tailwindcss.com) `@tailwindcss/vite` plugin-en keresztül
- **Interaktivitás:** [Alpine.js 3](https://alpinejs.dev) + `@alpinejs/intersect`
- **Képek:** `astro:assets` + `sharp` (képkénti `quality`, `widths`, `sizes`)
- **SEO:** `astro-seo`, `astro-seo-schema` (LocalBusiness), `astro-font`, `astro-robots-txt`, `@astrojs/sitemap`
- **Tömörítés:** `@playform/compress`
- **Eszközök:** Prettier + `prettier-plugin-astro`, `astro check`
- **Deploy:** GitHub Actions → GitHub Pages

## Követelmények

- **Node.js 20+** (a CI 20-as major verziót használ)
- **pnpm 10 vagy újabb** – a repó pnpm-et használ (`pnpm-lock.yaml`, `pnpm-workspace.yaml`), a CI a 10-es verziót pineli

## Telepítés

```sh
git clone https://github.com/fema3832/panjandrum.github.io.git
cd panjandrum.github.io
pnpm install
pnpm dev
```

A fejlesztői szerver a <http://localhost:4321> címen indul el.

## Parancsok

| Parancs               | Leírás                                               |
| :-------------------- | :--------------------------------------------------- |
| `pnpm install`        | Függőségek telepítése                                |
| `pnpm dev`            | Fejlesztői szerver a `localhost:4321` címen          |
| `pnpm build`          | Statikus build a `dist/` mappába                     |
| `pnpm preview`        | A `dist/` build lokális megtekintése                 |
| `pnpm astro`          | Astro CLI (`astro add`, `astro info`, stb.)          |
| `pnpm format`         | Prettier futtatása az összes fájlon                  |
| `pnpm check`          | `astro check` és a kódolás-ellenőrzés együtt         |
| `pnpm check:encoding` | Elcsúszott, dupla kódolású karakterek keresése       |
| `pnpm depcheck`       | Nem használt csomagok keresése (`pnpm dlx depcheck`) |

## Mappastruktúra

```text
/
├── .editorconfig                  # UTF-8 és LF kényszerítése minden eszközön
├── .github/workflows/deploy.yml   # build + deploy GitHub Pages-re
├── .prettierignore                # a formázó ne nyúljon a build kimenetéhez
├── public/
│   ├── icons/                     # favicon-ok, PWA ikonok
│   ├── videos/                    # háttérvideó (mp4) + poster (webp)
│   └── site.webmanifest
├── scripts/
│   └── check-encoding.mjs         # kódolás-őr, a `pnpm check` része
└── src/
    ├── entrypoint.ts              # Alpine pluginok regisztrálása
    ├── assets/
    │   ├── logo/                  # a szolgáltatás oldalakon automatikusan betöltött logók
    │   └── reference/             # referenciaképek
    ├── components/                # navbar, footer, hero, szekciók
    ├── layouts/Layout.astro       # SEO, fontok, skeleton loader, view transition
    ├── pages/
    │   ├── index.astro            # főoldal
    │   ├── about.astro            # Rólunk
    │   ├── reference.astro        # Referencia (lightbox)
    │   ├── contact.astro          # Kapcsolat
    │   ├── privacy-policy.astro   # Impresszum és adatkezelés
    │   └── services/              # hang-, fény- és videótechnika aloldalak
    └── styles/global.css          # Tailwind import + globális stílusok
```

## Oldalak

| Útvonal            | Tartalom                                       |
| :----------------- | :--------------------------------------------- |
| `/`                | Hero, szolgáltatás- és információs kártyák     |
| `/about/`          | Bemutatkozás, csapat, tapasztalat              |
| `/reference/`      | Korábbi munkák, lightbox-szal                  |
| `/contact/`        | Elérhetőségek                                  |
| `/services/sound/` | Hangtechnika, eszközpark-böngésző fülváltással |
| `/services/light/` | Fénytechnika, ugyanez a fülváltásos mintával   |
| `/services/video/` | Videó- és színpadtechnika                      |
| `/privacy-policy/` | Impresszum / adatkezelési tájékoztató          |

## Deploy (GitHub Pages)

A `.github/workflows/deploy.yml` minden `main` ágra küldött push után (vagy kézi futtatással) lefut:

1. `pnpm install --frozen-lockfile`
2. `astro build --site <origin> --base <base_path>` – a `site` és a `base` a GitHub Pages beállításaiból jön, ezért a gyökérdomain és a `*.github.io` aldomain is helyes lesz
3. a `dist/` feltöltése, majd a kiadás a `github-pages` környezetbe

**Egyszeri beállítás a repóban:** `Settings → Pages → Build and deployment → Source` = **GitHub Actions**. A workflow `contents: read`, `pages: write` és `id-token: write` jogosultságokat kér.

## Konfiguráció

- **`site`** az `astro.config.mjs`-ben kötelező: a sitemap és a canonical URL-ek csak így generálódnak; a CI a `--site` flaggel felülírja.
- **Képtömörítés:** az Astro 5 `sharp` szolgáltatása nem olvas globális `quality` konfigot az `image.service.config`-ből, ezért a tömörítés képkénti `quality={...}` proppal állítható (lásd `index.astro`, `textsection.astro`).
- **Alpine pluginok:** új plugint a `src/entrypoint.ts` fájlhoz kell adni; ezt köti be az `astro.config.mjs` `alpinejs({ entrypoint: '/src/entrypoint' })` sora.
- **Betűtípus:** az `Inter` a Google Fonts CDN-ről jön (`preconnect` az `Layout.astro`-ban), `astro-font` `preload` + `display: swap` beállítással.

## Hol szerkeszd a tartalmat

- **Szövegek:** a megfelelő fájlban a `src/pages/` és `src/components/` mappákban.
- **Eszközlogók:** a `src/assets/logo/` mappába kerülő SVG-ket a szolgáltatás oldalak `import.meta.glob` segítségével automatikusan betöltik, a fájlnév lesz a megjelenő név.
- **Képek:** `src/assets/` (névvel importálva, `astro:assets` `Image` komponenssel) – mindig adj `widths` és `sizes` értéket, különben nem készülnek reszponzív kliensoldali formátumok. A skeleton-pulzálást a `data-no-skeleton` attribútum kapcsolja ki.
- **Háttérvideó:** `public/videos/background_loop.mp4` és a hozzá tartozó `public/videos/background.webp` poster.
- **SEO és jogi szöveg:** `src/layouts/Layout.astro` (title, description, OG, LocalBusiness séma) és `src/pages/privacy-policy.astro` (impresszum, adatkezelés).

## Megjegyzések

- Az oldalátmenetek `<ClientRouter />` view transitionöket használnak; a `fade-in-blur` / `fade-out-blur` animációk a `global.css`-ben testreszabhatók.
- `prefers-reduced-motion: reduce` esetén a dekoratív, végtelen animációk automatikusan kikapcsolnak.
- **Kódolás:** minden szövegfájl UTF-8 (`.editorconfig`). Ha egy fájlt rossz kódolással mentek el, az ékezetes betűk két karakterre esnek szét (az `á` például `U+00C3 U+00A1` alakban jelenik meg, a második tag rendszerint láthatatlan vezérlőkarakter). Ezt a `pnpm check:encoding` kiszűri, a deploy workflow pedig a build előtt lefuttat – így ilyen hiba nem kerülhet kiadásra.
- A repóban jelenleg nincs `LICENSE` fájl; a szövegek, képek és logók a Panjandrum tulajdonában vannak.

## Linkek

- [Astro dokumentáció](https://docs.astro.build)
- [Astro – projektstruktúra](https://docs.astro.build/en/basics/project-structure/)
- [GitHub Pages + Astro](https://docs.astro.build/en/guides/integrations-guide/github-pages/)
