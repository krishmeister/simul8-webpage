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
const clipL = (lx, ly, lw, lh) => ({ x: OX + lx * S, y: OY + ly * S, width: lw * S, height: lh * S });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 2400, height: 1640 }, deviceScaleFactor: 1.6 });
const page = await ctx.newPage();
await page.goto(base, { waitUntil: 'networkidle' });
await settle(page, 1000);

await shot(page, 'z1-full-dark');
// top section: title formatting + Geography bridge
await shot(page, 'z8-top-section', clipL(560, 20, 1180, 320));
// engine ensemble container (resting)
await shot(page, 'z15-ensemble-resting', clipL(840, 860, 850, 540));
// engine group selection
await page.getByRole('button', { name: 'Prediction & Simulation Engine', exact: true }).click();
await settle(page);
await shot(page, 'z16-ensemble-group', clipL(840, 860, 850, 540));
await page.keyboard.press('Escape');
await settle(page);
// orchestrator: listening overlay band + corpus
await shot(page, 'z9-orchestrator', clipL(60, 860, 850, 600));
// engines: tools lines, no AI tag
await shot(page, 'z10-engines', clipL(860, 880, 820, 520));
// input panels: AI-LLM badges
await shot(page, 'z5-input-light-DARK', clipL(80, 360, 1180, 360));
// fusion bar: move cards not clipped
await shot(page, 'z11-fusion', clipL(80, 1430, 2140, 175));

// calibration loop
await page.getByTestId('calib-toggle').click();
await settle(page);
await shot(page, 'z2-calibration-full');
// close-up of the loop labels clustering bottom-right + Output risers
await shot(page, 'z13-loop-labels', clipL(1050, 1340, 1250, 360));
// the Vault: 4 risers into Log/Calibration + internal Log->Calibration arrow
await shot(page, 'z14-vault-arrows', clipL(1640, 940, 700, 480));

await page.keyboard.press('Escape');
await settle(page);

// light theme: input panels (AI tags + contrast)
await page.getByTestId('theme-toggle').click();
await settle(page);
await shot(page, 'z5-input-light', clipL(80, 360, 1180, 360));

// The Bible — verify a table renders (in light theme here)
await page.getByTestId('bible-open').click();
await settle(page, 800);
await page.evaluate(() => {
  const t = document.querySelector('article table');
  if (t) t.scrollIntoView({ block: 'center' });
});
await settle(page, 500);
await page.screenshot({ path: join(out, 'z12-bible-table.png') });
console.log('saved z12-bible-table');

await ctx.close();
await browser.close();
console.log('zoom QA done ->', out);
