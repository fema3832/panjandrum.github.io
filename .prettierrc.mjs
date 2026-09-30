/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  // A munkafában Windowson a git CRLF sorvégeket hoz létre, a repóban viszont
  // LF van. Az 'auto' megőrzi, ami épp a fájlban található, így a `pnpm format`
  // nem írja át az egész projektet minden sorvég miatt.
  endOfLine: 'auto',
  // Tetszőleges saját szabályok:
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
};
