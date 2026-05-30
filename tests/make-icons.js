// Render the SVG app icon to PNG sizes for the PWA manifest.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const svg = fs.readFileSync(path.join(ROOT, 'app', 'icons', 'icon.svg'), 'utf8');
const candidates = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].filter(p => p && fs.existsSync(p));

(async () => {
  const browser = await chromium.launch(candidates.length ? { executablePath: candidates[0] } : {});
  for (const size of [192, 512]) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(`<style>html,body{margin:0}</style>${svg.replace('width="512" height="512"', `width="${size}" height="${size}"`)}`);
    await page.locator('svg').screenshot({ path: path.join(ROOT, 'app', 'icons', `icon-${size}.png`), omitBackground: false });
    await page.close();
    console.log('wrote icon-' + size + '.png');
  }
  await browser.close();
})();
