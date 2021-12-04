import { Permission, Browser } from 'puppeteer';

export const overridePermissions = (browser: Browser, url: string, permissions: Permission[] = ['geolocation', 'notifications']) => {
  const context = browser.defaultBrowserContext();
  context.overridePermissions(url, permissions);
};
