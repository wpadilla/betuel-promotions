import { Page } from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { credentials, ICredentials } from '../utils/credentials';
import urls from '../utils/urls';

export const login = async (page: Page, loginCredentials: ICredentials, emailRef: string, passRef: string, nextStepEnable?: boolean, submitButtonRef: string = 'button[type="submit"]') => {
  // await page.waitForTimeout(3000);
  await page.waitForSelector(emailRef);
  await page.type(emailRef, loginCredentials.email);
  // if the login is of two steps
  if (nextStepEnable) {
    await page.click(submitButtonRef);
    await page.waitForNavigation();
    await page.waitForTimeout(3000);
    const resCaptcha = await page.solveRecaptchas();
    console.log('solved recaptchas!', resCaptcha);
    await page.click(submitButtonRef);
    await page.waitForNavigation();
    // await page.waitForTimeout(3000);
  }

  await page.type(passRef, loginCredentials.pass);
  return Promise.all([
    page.click(submitButtonRef),
    page.waitForTimeout(3000),
    page.waitForNavigation(),
  ]);
};

export const corotosLogin = async (page: Page) => login(page, credentials.corotos, '#app_user_email', '#app_user_password');
export const fleaLogin = async (page: Page) => login(page, credentials.flea, '#login', '#password');
export const freeMarketLogin = async (page: Page) => login(page, credentials.freeMarket, '#user_id', '#password', true);

export const isLoggedInFacebook = async (page: Page) => {
  await page.goto(urls.facebook, {
    waitUntil: 'networkidle2',
  });
  await page.waitForSelector('div[role=feed]');
};

export const loginWithSessionFacebook = async (cookies: any, page: Page) => {
  console.log('Logging into Facebook using cookies');
  await page.setCookie(...cookies);
  // await page.goto(urls.facebook, { waitUntil: 'networkidle2' });
  await isLoggedInFacebook(page).catch((error: any) => {
    console.error('App is not logged into Facebook');
    throw error;
  });
};

export const facebookLogin = async (page: Page) => {
  // Load cookies from previous session
  const buffer = await fs.readFileSync(path.join(__dirname, '../data/cookies.json'));
  const data = buffer.toString().replace('"use strict"', '')
    .replace('//# sourceMappingURL=cookies.js.map', '')
    .replace('//# sourceMappingURL=cookies.js.map', '')
    .replace(/[;]/gi, '');
  const cookies = data ? JSON.parse(data) : undefined;
  // Use our cookies to login. If it fails fallback to username and password login.
  if (cookies && Object.keys(cookies).length) {
    await loginWithSessionFacebook(cookies, page).catch(async (error: any) => {
      console.error(`Unable to login using session: ${error}`);
      await login(page, credentials.facebook, '#email', '#pass');
    });

  } else {
    await login(page, credentials.facebook, '#email', '#pass');
  }

  await page.cookies().then(async (freshCookies) => {
    await fs.writeFileSync(path.join(__dirname, '../data/cookies.json'), JSON.stringify(freshCookies, null, 2));
  });
};
