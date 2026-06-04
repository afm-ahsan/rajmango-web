const { chromium } = require('playwright');
const { writeFileSync } = require('fs');

const BASE = 'http://localhost:4200';
const OUT = 'C:\\Users\\afmah\\AppData\\Local\\Temp\\verify-mango';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function tryLogin(page) {
  await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(1500);
  await page.screenshot({ path: `${OUT}-01-login.png` });

  // Try multiple selectors
  const emailFilled = await page.fill('input[type="email"]', 'admin@rajmango.com').then(() => true).catch(() => false)
    || await page.fill('input[formcontrolname="email"]', 'admin@rajmango.com').then(() => true).catch(() => false);
  const passFilled = await page.fill('input[type="password"]', 'Admin@123').then(() => true).catch(() => false);

  if (!emailFilled || !passFilled) {
    // Try first two inputs
    const inputs = page.locator('input');
    const count = await inputs.count();
    console.log('Input fields found:', count);
    if (count >= 2) {
      await inputs.nth(0).fill('admin@rajmango.com');
      await inputs.nth(1).fill('Admin@123');
    }
  }

  await page.screenshot({ path: `${OUT}-02-login-filled.png` });
  // Click the submit/login button
  await page.click('button[type="submit"]').catch(() => {});
  await page.waitForNavigation({ timeout: 15000 }).catch(() => {});
  await sleep(3000);
  await page.screenshot({ path: `${OUT}-03-after-login.png` });
  console.log('After login URL:', page.url());
}

async function extractMangoData(page, label, path) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 25000 });
  await sleep(2500);
  await page.screenshot({ path, fullPage: true });

  // Prices: ৳X/kg in green
  const prices = await page.$$eval(
    '.text-success, .mango-price',
    els => els
      .map(e => e.innerText.trim())
      .filter(t => t.includes('৳') || t.includes('/kg'))
      .slice(0, 5)
  ).catch(() => []);

  // Date chips/badges
  const dates = await page.$$eval(
    '.badge-light-primary, .badge-light-warning, .badge-light-danger, .mango-date-chip',
    els => els.map(e => e.innerText.trim()).filter(Boolean).slice(0, 10)
  ).catch(() => []);

  console.log(`\n--- ${label} ---`);
  console.log('  Prices :', prices);
  console.log('  Dates  :', dates);
  return { prices, dates };
}

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', e => consoleErrors.push(`PAGE ERROR: ${e.message}`));

  try {
    await tryLogin(page);

    const currentUrl = page.url();
    if (currentUrl.includes('/auth/login')) {
      console.log('LOGIN FAILED — still on login page. Trying customer credentials...');
      await page.fill('input[type="email"]', 'customer@rajmango.com').catch(() => {});
      await page.fill('input[type="password"]', 'Customer@123').catch(() => {});
      await page.click('button[type="submit"]').catch(() => {});
      await page.waitForNavigation({ timeout: 10000 }).catch(() => {});
      await sleep(2000);
      console.log('URL after 2nd attempt:', page.url());
    }

    // 1. Customer dashboard
    const dashPath = `${OUT}-04-dashboard.png`;
    const dash = await extractMangoData(page, 'Customer Dashboard', '/dashboard/customer');
    await (async () => {
      await page.goto(`${BASE}/dashboard/customer`, { waitUntil: 'networkidle', timeout: 25000 });
      await sleep(2500);
      await page.screenshot({ path: dashPath, fullPage: true });
    })();

    // 2. Home
    const homePath = `${OUT}-05-home.png`;
    const home = await extractMangoData(page, 'Home', '/home');
    await (async () => {
      await page.goto(`${BASE}/home`, { waitUntil: 'networkidle', timeout: 25000 });
      await sleep(2500);
      await page.screenshot({ path: homePath, fullPage: true });
    })();

    // 3. Catalog
    const catPath = `${OUT}-06-catalog.png`;
    const cat = await extractMangoData(page, 'Catalog', '/mango-catalog/catalog');
    await (async () => {
      await page.goto(`${BASE}/mango-catalog/catalog`, { waitUntil: 'networkidle', timeout: 25000 });
      await sleep(2500);
      await page.screenshot({ path: catPath, fullPage: true });
    })();

    // 4. Detail modal
    await page.goto(`${BASE}/home`, { waitUntil: 'networkidle', timeout: 25000 });
    await sleep(2500);
    const viewBtn = page.locator('button:has-text("View Detail")').first();
    const viewBtnCount = await page.locator('button:has-text("View Detail")').count();
    console.log('\n  View Detail buttons found:', viewBtnCount);
    if (viewBtnCount > 0) {
      await viewBtn.click();
      await sleep(1500);
      await page.screenshot({ path: `${OUT}-07-modal.png` });
      const modalPrices = await page.$$eval(
        '.modal .text-success, .modal-body .text-success, .modal .fs-2',
        els => els.map(e => e.innerText.trim()).filter(t => t.includes('৳') || t.includes('/kg')).slice(0, 3)
      ).catch(() => []);
      const modalDates = await page.$$eval(
        '.modal .badge-light-primary, .modal .badge-light-warning, .modal .badge',
        els => els.map(e => e.innerText.trim()).filter(t => t.toLowerCase().includes('from') || t.toLowerCase().includes('until')).slice(0, 4)
      ).catch(() => []);
      console.log('\n--- Mango Detail Modal ---');
      console.log('  Modal prices:', modalPrices);
      console.log('  Modal dates:', modalDates);
    }

    // Confirm no $any() in live HTML
    const liveHtml = await page.content();
    console.log('\n$any() in live HTML:', liveHtml.includes('$any('));

    // Console errors
    const tsErrors = consoleErrors.filter(e => e.includes('TS') || e.includes('TypeError') || e.includes('undefined'));
    console.log('Console TS/type errors:', tsErrors.length ? tsErrors.slice(0, 5) : 'none');
    console.log('All console errors:', consoleErrors.length);

    // Summaries
    console.log('\n=========== RESULT ===========');
    const checks = [
      ['Dashboard prices', dash.prices.length > 0],
      ['Dashboard date chips', dash.dates.length > 0],
      ['Home prices', home.prices.length > 0],
      ['Home date chips', home.dates.length > 0],
      ['Catalog prices', cat.prices.length > 0],
      ['Catalog date chips', cat.dates.length > 0],
    ];
    let allPass = true;
    for (const [name, ok] of checks) {
      console.log(`  ${ok ? 'PASS' : 'FAIL'} ${name}`);
      if (!ok) allPass = false;
    }
    console.log('\nOverall:', allPass ? 'PASS' : 'FAIL');
    console.log('Screenshots saved to:', OUT + '-*.png');

  } catch (err) {
    console.error('ERROR:', err.message);
    await page.screenshot({ path: `${OUT}-error.png` }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
