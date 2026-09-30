// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import alpinejs from '@astrojs/alpinejs';

import robotsTxt from 'astro-robots-txt';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // MEGJEGYZÉS: az Astro 5 sharp szolgáltatása NEM olvas globális `quality`
  // konfigot a `image.service.config`-ből – csak a `kernel` és a
  // `limitInputPixels` mezőket. A tömörítés ezért képkénti `quality`
  // proppal állítható (lásd: index.astro, textsection.astro).
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },

  site: 'https://panjandrum.hu', // KÖTELEZŐ, e nélkül nem generál semmit
  integrations: [
    alpinejs({ entrypoint: '/src/entrypoint' }),
    robotsTxt(),
    sitemap(),
    (await import('@playform/compress')).default(),
  ],
});
