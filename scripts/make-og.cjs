// Renders public/og.jpg (final video frame + logo + title). Run: node scripts/make-og.cjs
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('file://' + path.join(__dirname, 'og.html'), { waitUntil: 'networkidle' });
  await p.screenshot({ path: path.join(__dirname, '..', 'public', 'og.jpg'), type: 'jpeg', quality: 85 });
  await b.close();
})();
