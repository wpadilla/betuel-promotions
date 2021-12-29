import * as minify from 'url-minify';

const prettylink = require('prettylink');

export const whatsappPhone = '+18298937075';

const urls = {
  facebook: 'https://www.facebook.com/',
  corotos: 'https://www.corotos.com.do/',
  flea: 'https://www.lapulga.com.do/',
  corotosLogin: 'https://www.corotos.com.do/app_users/sign_in',
  fleaLogin: 'https://www.lapulga.com.do/login',
  freeMarketLogin: 'https://www.mercadolibre.com/jms/mrd/lgz/msl/login/',
  freeMarket: 'https://www.mercadolibre.com.do/',
  fleaNewPub: 'https://www.lapulga.com.do/publicar',
  corotosNewPub: 'https://www.corotos.com.do/listing_wizards',
  facebookMarketPlace: 'https://www.facebook.com/marketplace/create/item',
  getWhatsappMessageURL: async (message: string) => {
    // Init Access Token in constructor
    const bitly = new prettylink.Bitly('148ea04a1150f74e1cf96981a6214744806c123b');

    // Or use init function


    const url = `https://wa.me/${whatsappPhone}?text=${encodeURI(message)}`;
    const shortenUrl = await bitly.short(url);
    // Shorten with Alias Promise Example
    return shortenUrl.link || url;
  },
};

export default urls;
