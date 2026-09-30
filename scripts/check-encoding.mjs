#!/usr/bin/env node
/**
 * Kódolás-őr: kiszűri a dupla kódolásból származó elcsúszott karaktereket.
 *
 * A hiba akkor keletkezik, ha egy UTF-8 fájlt valaki Windows-1252-ként
 * (a "rendszer kódlapja", amit a PowerShell 5.1 `Get-Content` /
 * `Set-Content` alapértelmezésben használ) dekódol, majd újra UTF-8-ként
 * ment. Ilyenkor minden ékezetes karakter két karakterre esik szét:
 *
 *   "á" (U+00E1)  ->  U+00C3 U+00A1   (latszatan C1 vezerlokarakterrel)
 *   "ő" (U+0151)  ->  U+00C5 U+2018
 *
 * A masodik tag mindig a 0x80-0xAF bajtok egyike, amit a cp1252
 * U+0080-U+00BF kozre fordit le, igy a hiba a legtobb szerkesztoben
 * lathatatlan, csak a build utan latszik elcsuszott betukent.
 *
 * Hasznalat: pnpm check:encoding  (a `pnpm check` resze, CI-ban is fut)
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

// Ellenorizendo fajlok; parametereivel felulirhatok (pl. egy konkrekt fajl).
const args = process.argv.slice(2);
const TARGETS = args.length > 0 ? args : ['src', 'public', '*.md'];

const EXTENSIONS = new Set([
  '.astro',
  '.ts',
  '.js',
  '.mjs',
  '.cjs',
  '.css',
  '.json',
  '.html',
  '.md',
  '.svg',
  '.txt',
  '.yml',
  '.yaml',
]);

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  '.astro',
  '.astro-doctor',
]);

const CHECKS = [
  {
    name: 'dupla kodolas',
    re: /[\u00C2-\u00DF][\u0080-\u00BF\u2018\u2019\u201A\u201C\u201D\u201E\u2020\u2021\u2022\u2026\u2030\u20AC\u2122\u0152\u0153\u0160\u0161\u017D\u017E\u02DC]/,
    hint: 'a fajl UTF-8 helyett Windows-1252 kódolással íródott',
  },
  {
    name: 'C1 vezerlokarakter',
    re: /[\u0080-\u009F]/,
    hint: 'lathatatlan vezerlokarakter a szovegben, a dupla kodolas nyoma',
  },
  {
    name: 'ervenytelen UTF-8',
    re: /\uFFFD/,
    hint: 'a fajlban nem UTF-8 bajtok vannak, vagy a javitas maradt reszben',
  },
];

/** A "*.md" / "src/*.astro" mintát regexszé alakítja (csak a * joker). */
function globToRegExp(pattern) {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`, 'i');
}

/** Felépíti az ellenőrzendő fájlok listáját: könyvtár, minta vagy konkrét útvonal. */
function* resolveTargets(targets) {
  for (const target of targets) {
    if (target.includes('*')) {
      const slash = target.lastIndexOf('/');
      const dirPart = slash === -1 ? '' : target.slice(0, slash);
      const pattern = slash === -1 ? target : target.slice(slash + 1);
      const base = dirPart === '' ? ROOT : join(ROOT, dirPart);
      const re = globToRegExp(pattern);
      let entries;
      try {
        entries = readdirSync(base, { withFileTypes: true });
      } catch {
        continue;
      }
      for (const entry of entries) {
        if (entry.isFile() && re.test(entry.name)) yield join(base, entry.name);
      }
      continue;
    }

    const abs = join(ROOT, target);
    let isDir = false;
    try {
      isDir = statSync(abs).isDirectory();
    } catch {
      console.warn(`Kihagyva (nem létezik): ${target}`);
      continue;
    }
    if (isDir) {
      yield* walk(abs);
    } else if (EXTENSIONS.has(extname(abs).toLowerCase())) {
      yield abs;
    }
  }
}

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(join(dir, entry.name));
    } else if (EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      yield join(dir, entry.name);
    }
  }
}

const findings = [];
let scanned = 0;

for (const file of resolveTargets(TARGETS)) {
  scanned++;
  const rel = relative(ROOT, file).split('\\').join('/');
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, index) => {
    for (const { name, re, hint } of CHECKS) {
      const match = re.exec(line);
      if (!match) continue;
      const codepoints = [...match[0]]
        .map(
          (c) =>
            'U+' + c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')
        )
        .join(' ');
      findings.push({
        rel,
        line: index + 1,
        col: match.index + 1,
        snippet: line.trim().slice(0, 70),
        name,
        codepoints,
        hint,
      });
    }
  });
}

if (findings.length === 0) {
  console.log(`Kódolás rendben: ${scanned} fájl, nincs elcsúszott karakter.`);
  process.exit(0);
}

console.error(
  `Kódolási hiba: ${findings.length} elcsúszott szekvencia ${scanned} fájlban\n`
);
for (const f of findings) {
  console.error(`  ${f.rel}:${f.line}:${f.col}  [${f.name}]  ${f.snippet}`);
  console.error(`      ${f.codepoints}  –  ${f.hint}`);
}
console.error(
  '\nJavítás: nyisd meg a fájlt UTF-8 kódolással (VS Code: "Save with Encoding" -> UTF-8)'
);
process.exit(1);
