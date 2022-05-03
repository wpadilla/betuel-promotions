import { Browser } from 'puppeteer';
import { EcommerceTypes } from './credentials';
import { SocketIoServer } from '../index';
import { EcommerceEvents } from '../models/enums';
import { ECommerceResponse } from '../models/common';
import { availableEcommerce } from './ecommerce';

const errorsCount: {[N in EcommerceTypes]: number} = {
  corotos: 0,
  facebook: 0,
  freeMarket: 0,
  flea: 0,
};

export const handlePublicationError = (error: Error, ecommerceType: EcommerceTypes, retry: () => any, browser: Browser) => {
  if (errorsCount[ecommerceType] >= 3) {
    errorsCount[ecommerceType] = 0;
    browser.close();
    SocketIoServer.emit(EcommerceEvents.EMIT_FAILED,
      new ECommerceResponse(
        {
          status: 'failed',
          ecommerce: availableEcommerce.facebook,
          error: error.message,
        },
      ));
  } else {
    errorsCount[ecommerceType] += errorsCount[ecommerceType] + 1;
    retry();
  }
};
