/**
 * Headless showroom QA — screenshots for rubric self-score.
 * Usage: node scripts/showroom-qa.mjs [--url http://localhost:5180]
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'showroom-qa-screenshots');
const BASE_URL = process.argv.includes('--url')
  ? process.argv[process.argv.indexOf('--url') + 1]
  : 'http://localhost:5173';

async function waitForScene(page) {
  await page.waitForSelector('canvas', { timeout: 30000 });
  await page.waitForTimeout(2500);
}

async function screenshot(page, name) {
  const file = path.join(OUT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`screenshot: ${file}`);
  return file;
}

async function clickChip(page, label) {
  await page.evaluate((name) => {
    const btn = [...document.querySelectorAll('button')].find(
      (b) => b.textContent?.trim() === name,
    );
    btn?.click();
  }, label);
  await page.waitForTimeout(1200);
}

async function selectFloor(page) {
  const canvas = page.locator('canvas').first();
  const box = await canvas.boundingBox();
  if (!box) return;
  await page.mouse.click(box.x + box.width * 0.42, box.y + box.height * 0.62);
  await page.waitForTimeout(400);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  const shots = [];

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await waitForScene(page);
    shots.push(await screenshot(page, '01-initial'));

    await selectFloor(page);

    // Apply glossy tile via keyboard (design 1)
    await page.keyboard.press('1');
    await page.waitForTimeout(800);
    shots.push(await screenshot(page, '02-glossy-tile'));

    // Toggle matte
    await page.keyboard.press('m');
    await page.waitForTimeout(800);
    shots.push(await screenshot(page, '03-matte-tile'));

    // Open catalogue on narrow layout toggle if visible
    const toggle = page.getByRole('button', { name: /catalogue/i });
    if (await toggle.isVisible().catch(() => false)) {
      await toggle.click();
      await page.waitForTimeout(400);
    }
    shots.push(await screenshot(page, '04-catalogue'));

    // Camera preset
    if (await page.getByRole('button', { name: 'Window' }).isVisible().catch(() => false)) {
      await clickChip(page, 'Window');
      shots.push(await screenshot(page, '05-window-view'));
    }

    if (await page.getByRole('button', { name: 'Bathroom' }).isVisible().catch(() => false)) {
      await clickChip(page, 'Bathroom');
      shots.push(await screenshot(page, '06-bathroom'));
    }
  } finally {
    await browser.close();
  }

  const report = {
    url: BASE_URL,
    screenshots: shots,
    consoleErrors: errors.filter((e) => !e.includes('GPU stall') && !e.includes('deprecated')),
    timestamp: new Date().toISOString(),
  };

  await writeFile(path.join(OUT_DIR, 'report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));

  if (report.consoleErrors.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
