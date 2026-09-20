// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import alpinejs from '@astrojs/alpinejs';

import robotsTxt from 'astro-robots-txt';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },

  site: 'https://panjandrum.hu/', // KÖTELEZŐ, e nélkül nem generál semmit
  integrations: [
    alpinejs(),
    robotsTxt(),
    sitemap(),
    (await import('@playform/compress')).default(),
  ],
});
