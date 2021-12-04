import { Page } from 'puppeteer';
import { credentials } from '../utils/credentials';

export const facebookLogin = async (page: Page) => {
  await page.waitForTimeout(3000);
  await page.waitForSelector('#email');
  await page.type('#email', credentials.fbCredentials.email);
  await page.type('#pass', credentials.fbCredentials.pass);
  return await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNetworkIdle(),
  ]);
};
