// Visual QA harness — drives the diagram in a real browser and saves screenshots.
// Usage: node scripts/qa.mjs [baseURL]
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const base = process.argv[2] || 'http://localhost:5173';
const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', '.qa');
mkdirSync(out, { recursive: true });

const shot = async (page, name) => {
  await page.screenshot({ path: join(out, name + '.png'), fullPage: false });
  console.log('saved', name);
};
const settle = (page, ms = 700) => page.waitForTimeout(ms);

const browser = await chromium.launch();

// ---------- DESKTOP ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await settle(page, 1000);
  await shot(page, '01-desktop-dark');

  await page.getByTestId('theme-toggle').click();
  await settle(page);
  await shot(page, '02-desktop-light');

  await page.getByTestId('theme-toggle').click(); // back to dark
  await settle(page);

  // click a node to open the full-description panel
  await page.getByRole('button', { name: 'Bayesian Prediction' }).click();
  await settle(page);
  await shot(page, '03-desktop-detail');

  await page.keyboard.press('Escape');
  await settle(page);
  await shot(page, '04-desktop-after-esc');

  // hero: calibration loop
  await page.getByTestId('calib-toggle').click();
  await settle(page);
  await shot(page, '05-desktop-calibration');

  await page.keyboard.press('Escape');
  await settle(page);
  await shot(page, '06-desktop-esc-from-calib');

  // engine ensemble: group selection (click the header) vs single engine
  await page.getByRole('button', { name: 'Prediction & Simulation Engine', exact: true }).click();
  await settle(page);
  await shot(page, '13-desktop-engine-group');
  await page.keyboard.press('Escape');
  await settle(page);
  await page.getByRole('button', { name: 'System Dynamics' }).click();
  await settle(page);
  await shot(page, '14-desktop-engine-single');
  await page.keyboard.press('Escape');
  await settle(page);

  // The Bible slide-over
  await page.getByTestId('bible-open').click();
  await settle(page, 900);
  await shot(page, '10-desktop-bible');
  await page.keyboard.press('Escape');
  await settle(page);
  await shot(page, '11-desktop-esc-from-bible');

  await ctx.close();
}

// ---------- MOBILE (375px) ----------
{
  const iPhone = devices['iPhone SE'] || devices['iPhone 12'];
  const ctx = await browser.newContext({ ...iPhone, viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await settle(page, 1000);
  await shot(page, '07-mobile-dark');

  await page.getByRole('button', { name: 'Causal Modeling' }).click();
  await settle(page);
  await shot(page, '08-mobile-sheet');

  await page.keyboard.press('Escape').catch(() => {});
  await settle(page);

  await page.getByTestId('calib-toggle').click();
  await settle(page);
  await shot(page, '09-mobile-calibration');

  await page.keyboard.press('Escape').catch(() => {});
  await settle(page);
  await page.getByTestId('bible-open').click();
  await settle(page, 900);
  await shot(page, '12-mobile-bible');

  await ctx.close();
}

await browser.close();
console.log('QA done ->', out);
