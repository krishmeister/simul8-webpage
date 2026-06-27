// QA for the "See it in action" demo mode.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const base = process.argv[2] || 'http://localhost:5173';
const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, '..', '.qa');
mkdirSync(out, { recursive: true });

const settle = (p, ms = 600) => p.waitForTimeout(ms);
const shot = async (p, name, clip) => {
  await p.screenshot({ path: join(out, name + '.png'), clip });
  console.log('saved', name);
};

const browser = await chromium.launch();

// ---------- DESKTOP flow + output ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
  const p = await ctx.newPage();
  await p.goto(base, { waitUntil: 'networkidle' });
  await settle(p, 900);
  await shot(p, 'd01-launcher');

  await p.getByTestId('demo-launcher').click();
  await settle(p);
  await shot(p, 'd02-picker');

  await p.getByTestId('demo-scenario-tees').click();
  await settle(p, 900);
  await shot(p, 'd03-playing-stage0');

  // jump to engines stage via the rail
  await p.getByTestId('demo-stage-engines').click();
  await settle(p);
  await shot(p, 'd04-engines-tees');

  // jump to output
  await p.getByTestId('demo-stage-output').click();
  await settle(p, 700);
  await shot(p, 'd05-output-outcome');

  await p.getByTestId('output-tab-journey').click();
  await settle(p);
  await shot(p, 'd06-output-journey');
  await p.evaluate(() => {
    const el = document.querySelector('[data-testid="demo-output"] [class*="content"]');
    if (el) el.scrollTop = el.scrollHeight;
  });
  await settle(p);
  await shot(p, 'd06b-journey-scrolled');

  await p.getByTestId('output-tab-interrogate').click();
  await settle(p);
  await shot(p, 'd07-interrogate-before');
  await p.getByTestId('interrogate-slider').evaluate((el) => {
    // use the native value setter so React's onChange fires (mimics a real drag)
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, '62');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await settle(p);
  await shot(p, 'd08-interrogate-after');

  await p.getByTestId('output-tab-share').click();
  await settle(p);
  await shot(p, 'd09-output-share');

  await p.keyboard.press('Escape');
  await settle(p);
  await shot(p, 'd10-after-esc');

  await ctx.close();
}

// ---------- engine mix per scenario (large viewport, clip engines) ----------
{
  const ctx = await browser.newContext({ viewport: { width: 2400, height: 1640 }, deviceScaleFactor: 1.3 });
  const p = await ctx.newPage();
  await p.goto(base, { waitUntil: 'networkidle' });
  await settle(p, 900);
  const S = 0.82, OX = 257, OY = 49;
  const engClip = { x: OX + 840 * S, y: OY + 860 * S, width: 850 * S, height: 540 * S };
  for (const [id, name] of [['tees', 'tees'], ['protein', 'protein'], ['sneakers', 'sneakers'], ['tws', 'earbuds']]) {
    await p.getByTestId('demo-launcher').click();
    await settle(p);
    await p.getByTestId(`demo-scenario-${id}`).click();
    await settle(p, 500);
    await p.getByTestId('demo-stage-engines').click();
    await settle(p, 500);
    await shot(p, `d-mix-${name}`, engClip);
    await p.keyboard.press('Escape');
    await settle(p, 300);
  }
  await ctx.close();
}

// ---------- light theme ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
  const p = await ctx.newPage();
  await p.goto(base, { waitUntil: 'networkidle' });
  await settle(p, 800);
  await p.getByTestId('theme-toggle').click();
  await settle(p);
  await p.getByTestId('demo-launcher').click();
  await settle(p);
  await shot(p, 'd11-picker-light');
  await p.getByTestId('demo-scenario-protein').click();
  await settle(p, 500);
  await p.getByTestId('demo-stage-output').click();
  await settle(p, 600);
  await shot(p, 'd12-output-light');
  await ctx.close();
}

// ---------- mobile 375 ----------
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(base, { waitUntil: 'networkidle' });
  await settle(p, 900);
  await shot(p, 'd13-mobile-launcher');
  await p.getByTestId('demo-launcher').click();
  await settle(p);
  await shot(p, 'd14-mobile-picker');
  await p.getByTestId('demo-scenario-sneakers').click();
  await settle(p, 600);
  await shot(p, 'd15-mobile-playing');
  await p.getByTestId('demo-stage-output').click();
  await settle(p, 600);
  await shot(p, 'd16-mobile-output');
  await ctx.close();
}

await browser.close();
console.log('demo QA done ->', out);
