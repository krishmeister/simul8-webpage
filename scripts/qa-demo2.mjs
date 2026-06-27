// QA for the demo refinements: manual (no autoplay) + right-docked controller.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const base = process.argv[2] || 'http://localhost:5173';
const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', '.qa');
mkdirSync(out, { recursive: true });
const settle = (p, ms = 600) => p.waitForTimeout(ms);
const shot = async (p, n) => { await p.screenshot({ path: join(out, n + '.png') }); console.log('saved', n); };
const counter = (p) => p.getByTestId('demo-controller').locator('text=/Stage \\d \\/ 7/').first().textContent();

const browser = await chromium.launch();

// ---------- desktop: right dock + no autoplay + step through ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
  const p = await ctx.newPage();
  await p.goto(base, { waitUntil: 'networkidle' });
  await settle(p, 800);
  await p.getByTestId('demo-launcher').click();
  await settle(p);
  await p.getByTestId('demo-scenario-tees').click();
  await settle(p, 900);
  const c0 = await counter(p);
  await shot(p, 'r01-stage0-rightdock');

  // NO AUTOPLAY: wait 4.5s, counter must be unchanged
  await settle(p, 4500);
  const c0b = await counter(p);
  console.log('autoplay check: before=', c0, ' after 4.5s=', c0b, c0 === c0b ? '-> OK (no autoplay)' : '-> FAIL (advanced)');
  await shot(p, 'r02-after-wait');

  // step through all stages via Next, screenshotting engines/fusion
  await p.getByTestId('demo-next').click(); await settle(p); // accumulate
  await p.getByTestId('demo-next').click(); await settle(p); // intent
  await p.getByTestId('demo-next').click(); await settle(p); // method
  await p.getByTestId('demo-next').click(); await settle(p); // engines
  console.log('at', await counter(p));
  await shot(p, 'r03-engines-rightdock');
  await p.getByTestId('demo-next').click(); await settle(p); // fusion
  await shot(p, 'r04-fusion-rightdock');
  await p.getByTestId('demo-next').click(); await settle(p, 700); // output
  await shot(p, 'r05-output');

  await ctx.close();
}

// ---------- mobile: bottom sheet ----------
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(base, { waitUntil: 'networkidle' });
  await settle(p, 800);
  await p.getByTestId('demo-launcher').click();
  await settle(p);
  await p.getByTestId('demo-scenario-tws').click();
  await settle(p, 700);
  await shot(p, 'r06-mobile-bottomsheet');
  await ctx.close();
}

await browser.close();
console.log('refinement QA done');
