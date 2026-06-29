// Visual QA for the cohort loop. Captures resting + lit states in both themes
// and viewports, plus crisp close-ups of the two new boxes (badges legible).
// Usage: node scripts/qa-cohort.mjs [baseURL]
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const base = process.argv[2] || 'http://localhost:5173';
const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', '.qa-cohort');
mkdirSync(out, { recursive: true });

const shot = async (page, name) => {
  await page.screenshot({ path: join(out, name + '.png'), fullPage: false });
  console.log('saved', name);
};
const settle = (page, ms = 700) => page.waitForTimeout(ms);

const browser = await chromium.launch();

// ---------- DESKTOP overview (dsf 2) ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await settle(page, 1000);
  await shot(page, '01-desktop-dark-rest');

  // light the cohort loop
  await page.getByTestId('cohort-toggle').click();
  await settle(page);
  await shot(page, '02-desktop-dark-cohort');

  // cohort detail panel content is visible (left dock)
  await shot(page, '02b-desktop-dark-cohort-panel');

  await page.keyboard.press('Escape');
  await settle(page);

  // calibration still works + resolved outcome branches to both loops
  await page.getByTestId('calib-toggle').click();
  await settle(page);
  await shot(page, '03-desktop-dark-calibration');
  await page.keyboard.press('Escape');
  await settle(page);

  // light theme
  await page.getByTestId('theme-toggle').click();
  await settle(page);
  await page.getByTestId('cohort-toggle').click();
  await settle(page);
  await shot(page, '04-desktop-light-cohort');
  await page.keyboard.press('Escape');
  await settle(page);

  // node detail panels (verify copy)
  await page.getByRole('button', { name: 'Cohort Aggregation' }).click();
  await settle(page);
  await shot(page, '05-light-cohort-agg-detail');
  await page.keyboard.press('Escape');
  await settle(page);
  await page.getByRole('button', { name: 'Anonymize & Aggregate' }).click();
  await settle(page);
  await shot(page, '06-light-anon-detail');
  await page.keyboard.press('Escape');
  await settle(page);

  await ctx.close();
}

// ---------- DESKTOP node close-ups (dsf 3, crisp badges) ----------
for (const theme of ['dark', 'light']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await settle(page, 900);
  if (theme === 'light') {
    await page.getByTestId('theme-toggle').click();
    await settle(page);
  }
  await page.getByRole('button', { name: 'Cohort Aggregation' }).screenshot({ path: join(out, `07-${theme}-box-cohort-agg.png`) });
  await page.getByRole('button', { name: 'Anonymize & Aggregate' }).screenshot({ path: join(out, `08-${theme}-box-anon.png`) });
  console.log('saved', theme, 'box close-ups');
  await ctx.close();
}

// ---------- MOBILE (375px) ----------
{
  const iPhone = devices['iPhone SE'] || devices['iPhone 12'];
  const ctx = await browser.newContext({ ...iPhone, viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await settle(page, 1000);
  await shot(page, '09-mobile-dark-rest');

  await page.getByTestId('cohort-toggle').click();
  await settle(page);
  await shot(page, '10-mobile-dark-cohort');

  await ctx.close();
}

await browser.close();
console.log('cohort QA done ->', out);
