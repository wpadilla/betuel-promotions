import { Browser } from 'puppeteer';
import { EcommerceTypes } from './credentials';

const errorsCount: {[N in EcommerceTypes]: number} = {
  corotos: 0,
  facebook: 0,
  freeMarket: 0,
  flea: 0,
};

export const handlePublicationError = (error: any, res: any, ecommerceType: EcommerceTypes, retry: () => any, browser: Browser) => {
  if (errorsCount[ecommerceType] >= 3) {
    errorsCount[ecommerceType] = 0;
    browser.close();
    res.status(500).json({ error: error.message });
  } else {
    errorsCount[ecommerceType] += errorsCount[ecommerceType] + 1;
    retry();
  }
};

