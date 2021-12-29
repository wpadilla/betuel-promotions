import { Page } from 'puppeteer';
import { credentials, ICredentials } from '../utils/credentials';

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
    // page.waitForTimeout(3000),
    page.waitForNavigation(),
  ]);
};

export const facebookLogin = async (page: Page) => login(page, credentials.facebook, '#email', '#pass');
export const corotosLogin = async (page: Page) => login(page, credentials.corotos, '#app_user_email', '#app_user_password');
export const fleaLogin = async (page: Page) => login(page, credentials.flea, '#login', '#password');
export const freeMarketLogin = async (page: Page) => login(page, credentials.freeMarket, '#user_id', '#password', true);
