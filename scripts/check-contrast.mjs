// Reads the palette from src/styles/tokens.css and checks WCAG contrast for every
// text/background pair the site uses. Run: npm run check:contrast
import { readFileSync } from 'node:fs';
import { parse, wcagContrast, formatHex } from 'culori';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
const root = css.slice(css.indexOf(':root'));
const tokens = Object.fromEntries(
  [...root.matchAll(/--c-([\w-]+):\s*(oklch\([^)]*\))/g)].map(([, k, v]) => [k, parse(v)])
);

const pairs = [
  ['text-dark', 'bg'], ['text-dark', 'surface'], ['primary', 'bg'], ['primary', 'surface'],
  ['secondary', 'bg'], ['clay-ink', 'bg'], ['text-light', 'primary'], ['text-light', 'secondary'],
  ['text-light', 'text-dark'], ['text-dark', 'accent'], ['accent', 'text-dark'],
];
let failed = 0;
for (const [fg, bg] of pairs) {
  const r = wcagContrast(tokens[fg], tokens[bg]);
  const ok = r >= 4.5;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2)}:1  ${fg} ${formatHex(tokens[fg])} on ${bg} ${formatHex(tokens[bg])}`);
}
process.exit(failed ? 1 : 0);
