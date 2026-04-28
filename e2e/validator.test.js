const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  let executablePath;
  // Определяем для локального запуска, если не хотим скачивать
  if (process.platform === 'linux') {
    executablePath = '/usr/bin/google-chrome';
  } // else оставляем undefined, пусть ищет сам
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    await page.goto('http://localhost:8080');
  } catch (error) {
    console.error('Failed to launch browser:', error);
    throw error;
  }
}, 30000);

afterAll(async () => {
  if (browser) {
    await browser.close();
  }
});

describe('Credit Card Validator E2E', () => {
  test('Valid Visa card – should activate Visa icon and show no error', async () => {
    await page.waitForSelector('#cardNumber');
    await page.waitForSelector('#checkBtn');
    await page.$eval('#cardNumber', el => el.value = '');
    await page.type('#cardNumber', '4111111111111111');
    await page.click('#checkBtn');
    // замена waitForTimeout
    await new Promise(resolve => setTimeout(resolve, 500));
    const isVisaActive = await page.$eval('[data-card="visa"]', img => img.classList.contains('active'));
    expect(isVisaActive).toBe(true);
    const errorText = await page.$eval('#errorMsg', el => el.textContent);
    expect(errorText).toBe('');
  });

  test('Valid MasterCard – should activate MasterCard icon', async () => {
    await page.$eval('#cardNumber', el => el.value = '');
    await page.type('#cardNumber', '5111111111111118');
    await page.click('#checkBtn');
    await new Promise(resolve => setTimeout(resolve, 500));
    const isMasterActive = await page.$eval('[data-card="mastercard"]', img => img.classList.contains('active'));
    expect(isMasterActive).toBe(true);
    const errorText = await page.$eval('#errorMsg', el => el.textContent);
    expect(errorText).toBe('');
  });

  test('Valid Mir card – should activate Mir icon', async () => {
    await page.$eval('#cardNumber', el => el.value = '');
    await page.type('#cardNumber', '2200000000000004');
    await page.click('#checkBtn');
    await new Promise(resolve => setTimeout(resolve, 500));

    const isMirActive = await page.$eval('[data-card="mir"]', img => img.classList.contains('active'));
    expect(isMirActive).toBe(true);
    const errorText = await page.$eval('#errorMsg', el => el.textContent);
    expect(errorText).toBe('');
  });

  test('Invalid card – shows error and no icon highlighted', async () => {
    await page.$eval('#cardNumber', el => el.value = '');
    await page.type('#cardNumber', '1234567890123456');
    await page.click('#checkBtn');
    await new Promise(resolve => setTimeout(resolve, 500));
    const anyActive = await page.$eval('.card-img.active', () => true).catch(() => false);
    expect(anyActive).toBe(false);
    const errorText = await page.$eval('#errorMsg', el => el.textContent);
    expect(errorText).toContain('Неизвестная платёжная система');
  });
});
