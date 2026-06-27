// Large-viewport QA — near-1:1 capture of the whole diagram for tracing arrows + contrast.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const base = process.argv[2] || 'http://localhost:5173';
const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', '.qa');
mkdirSync(out, { recursive: true });

const shot = async (page, name, clip) => {
  await page.screenshot({ path: join(out, name + '.png'), clip });
  console.log('saved', name);
};
const settle = (page, ms = 700) => page.waitForTimeout(ms);

// fit math for viewport 2400x1640: scale ~0.82, offsetX ~257, offsetY ~49
const S = 0.82, OX = 257, OY = 49;
const L2S = (lx, ly) => ({ x: OX + lx * S, y: OY + ly * S }); // logical -> screen
const clipL = (lx, ly, lw, lh) => ({ x: OX + lx * S, y: OY + ly * S, width: lw * S, height: lh * S });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 2400, height: 1640 }, deviceScaleFactor: 1.6 });
const page = await ctx.newPage();
await page.goto(base, { waitUntil: 'networkidle' });
await settle(page, 1000);

await shot(page, 'z1-full-dark');

// calibration loop
await page.getByTestId('calib-toggle').click();
await settle(page);
await shot(page, 'z2-calibration-full');
// The Vault + right-gutter risers (logical ~1600..2300 x 900..1450)
await shot(page, 'z3-vault-risers', clipL(1600, 900, 700, 560));
// Sub-task B arrival + left gutter (logical ~0..900 x 850..1450)
await shot(page, 'z6-subb-arrival', clipL(0, 850, 950, 600));

await page.keyboard.press('Escape');
await settle(page);

// light theme full + input panels close-up (contrast)
await page.getByTestId('theme-toggle').click();
await settle(page);
await shot(page, 'z4-full-light');
await shot(page, 'z5-input-light', clipL(80, 360, 1180, 360));
// orchestrator + engines close-up (contrast, dark again)
await page.getByTestId('theme-toggle').click();
await settle(page);
await shot(page, 'z7-orch-engines-dark', clipL(80, 880, 1600, 500));

await ctx.close();
await browser.close();
console.log('zoom QA done ->', out);
