"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappPhone = void 0;
const prettylink = require('prettylink');
exports.whatsappPhone = '+18298937075';
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
    getWhatsappMessageURL: (message) => __awaiter(void 0, void 0, void 0, function* () {
        // Init Access Token in constructor
        const bitly = new prettylink.Bitly('148ea04a1150f74e1cf96981a6214744806c123b');
        // Or use init function
        const url = `https://wa.me/${exports.whatsappPhone}?text=${encodeURI(message)}`;
        try {
            const shortenUrl = yield bitly.short(url);
            // Shorten with Alias Promise Example
            return shortenUrl.link || url;
        }
        catch (err) {
            return url;
        }
    }),
};
exports.default = urls;
//# sourceMappingURL=urls.js.map