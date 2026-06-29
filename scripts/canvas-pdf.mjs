// Render the entire diagram canvas (the 2760x1880 plane) at 1:1, high-DPI, and
// wrap it into a single-page PDF. Neutralises the pan/zoom transform so the whole
// plane is captured crisply rather than the fit-scaled viewport.
// Usage: node scripts/canvas-pdf.mjs [dark|light]
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const theme = process.argv[2] === 'light' ? 'light' : 'dark';
const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', '.qa-cohort');
mkdirSync(outDir, { recursive: true });
const pngPath = join(outDir, `simul8-cohort-canvas-${theme}.png`);
const pdfPath = join(outDir, `simul8-cohort-canvas-${theme}.pdf`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200); // let the fit-on-load settle

if (theme === 'light') {
  await page.getByTestId('theme-toggle').click();
  await page.waitForTimeout(400);
}

// Flatten the pan/zoom transform + clipping so the plane lays out at its natural
// size, and hide every fixed/sticky overlay (header, legend, toggles, zoom, demo
// launcher, any open panel) so only the diagram is captured.
const size = await page.evaluate(() => {
  const plane = [...document.querySelectorAll('div')].find((d) => d.style.width === '2760px' && d.style.height === '1880px');
  if (!plane) throw new Error('canvas plane not found');
  const ancestors = new Set();
  for (let p = plane; p; p = p.parentElement) ancestors.add(p);
  let el = plane;
  while (el && el !== document.body) {
    el.style.setProperty('transform', 'none', 'important');
    el.style.setProperty('transition', 'none', 'important');
    el.style.setProperty('overflow', 'visible', 'important');
    el.style.maxWidth = 'none';
    el.style.maxHeight = 'none';
    el = el.parentElement;
  }
  // Drop the floating UI chrome so it doesn't paint over the canvas region.
  for (const node of document.querySelectorAll('*')) {
    const pos = getComputedStyle(node).position;
    if ((pos === 'fixed' || pos === 'sticky') && !ancestors.has(node)) {
      node.style.setProperty('display', 'none', 'important');
    }
  }
  document.body.style.overflow = 'visible';
  document.documentElement.style.overflow = 'visible';
  return { w: plane.offsetWidth, h: plane.offsetHeight };
});
console.log('plane size', size);

const planeHandle = await page.evaluateHandle(() =>
  [...document.querySelectorAll('div')].find((d) => d.style.width === '2760px' && d.style.height === '1880px'),
);
await planeHandle.asElement().screenshot({ path: pngPath });
console.log('saved PNG', pngPath);

// Embed the high-res PNG into a single PDF page sized to the canvas (image is 2x → ~192dpi).
const b64 = readFileSync(pngPath).toString('base64');
const pdfPage = await ctx.newPage();
await pdfPage.setContent(
  `<!doctype html><html><body style="margin:0;padding:0;line-height:0;background:transparent;">` +
    `<img src="data:image/png;base64,${b64}" style="width:${size.w}px;height:${size.h}px;display:block;"></body></html>`,
);
await pdfPage.pdf({
  path: pdfPath,
  width: `${size.w}px`,
  height: `${size.h}px`,
  printBackground: true,
  pageRanges: '1',
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
});
console.log('saved PDF', pdfPath);

await browser.close();
