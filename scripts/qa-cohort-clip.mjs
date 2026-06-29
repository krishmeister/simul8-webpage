// Zoomed clips to judge the restructured cohort routing up close.
// Pass "rest" for the resting state (default lights the cohort loop).
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const rest = process.argv.includes('rest');
const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', '.qa-cohort');

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 });
const page = await ctx.newPage();
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
if (!rest) {
  await page.getByTestId('cohort-toggle').click();
  await page.waitForTimeout(700);
}
const pfx = rest ? 'rest-' : '';
const clips = {
  'clip-cat-bottom': { x: 350, y: 395, width: 320, height: 150 }, // 5th box + frame bottom + gap to Accumulated
  'clip-anon-landing': { x: 540, y: 410, width: 900, height: 90 }, // co-anon-agg into cohort-agg right side
  'clip-out-branch': { x: 980, y: 760, width: 460, height: 120 }, // co-out exit beside calibration arrows
};
for (const [name, clip] of Object.entries(clips)) {
  await page.screenshot({ path: join(out, pfx + name + '.png'), clip });
  console.log('saved', pfx + name);
}
await browser.close();
console.log('done');
