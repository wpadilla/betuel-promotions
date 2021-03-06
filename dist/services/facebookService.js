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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishInMarketplace = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const urls_1 = __importDefault(require("../utils/urls"));
const download_file_1 = __importDefault(require("../utils/download-file"));
const common_1 = require("../models/common");
const permissions_1 = require("../actions/permissions");
const login_1 = require("../actions/login");
const DOMRefs_1 = require("../utils/DOMRefs");
const errors_1 = require("../utils/errors");
const index_1 = require("../index");
const enums_1 = require("../models/enums");
const ecommerce_1 = require("../utils/ecommerce");
let pubIndex = 0;
const defaultTags = 'Betuel Tech\n Betuel\n Dios\n Cristo\n tecnologia\n accesorios\n wireless\n bluetooth\n inalambrico\n acesorios de celulares\n audifonos\n bocina\n sonido\n entretenimiento\n oferta\n barato\n calidad\n';
const publishInMarketplace = (publications, lastPage, lastBrowser) => __awaiter(void 0, void 0, void 0, function* () {
    const publication = publications[pubIndex];
    const isHeadless = publications.length <= 1;
    let page = lastPage || {};
    let browser = lastBrowser || {};
    try {
        if (!lastPage) {
            browser = yield puppeteer_1.default.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
            });
            page = yield browser.newPage();
            (0, permissions_1.overridePermissions)(browser, urls_1.default.facebook);
            yield page.goto(`${urls_1.default.facebook}login`);
            yield (0, login_1.facebookLogin)(page);
            yield page.waitForTimeout(3000);
        }
        page.goto(urls_1.default.facebookMarketPlace);
        yield page.waitForTimeout(3000);
        // TESTING
        // await page.goto('https://www.facebook.com/marketplace/you/selling');
        // await page.waitForTimeout(3000);
        //
        // all dom refs for facebook
        const inputRefs = DOMRefs_1.refObjFromKeys.facebook;
        const inputFile = yield page.$(inputRefs.inputFIle);
        yield page.waitForSelector(inputRefs.title);
        const whatsappURL = yield urls_1.default.getWhatsappMessageURL(`Estoy interesado en este producto "${publication.name}". ??A??n est?? disponible?  \n \n ${publication.image}`);
        // const whatsappURL = 'whatsapp';
        const productDescription = `${publication.description || publication.name} \n \n
    ???????????? Puedes pedir este producto por whatsapp presionando este enlace ???????????? \n
${whatsappURL}
    \n \n
${publication.GodWord || 'Recuerda que Jes??s te Ama'}`;
        yield (0, download_file_1.default)(publication.image, (filePath) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // uploading photo to the form
                inputFile && (yield inputFile.uploadFile(filePath));
                yield page.type(inputRefs.title, `${publication.name} | Betuel Tech`);
                yield page.type(inputRefs.price, publication.price.toString());
                // selecting state
                yield page.click(inputRefs.state);
                yield page.waitForTimeout(2000);
                // selecting Nuevo state
                yield page.evaluate(() => {
                    document.querySelectorAll('[role="listbox"] .oajrlxb2 .qzhwtbm6.knvmm38d')[0].click();
                });
                yield page.type(inputRefs.description, productDescription);
                yield page.type(inputRefs.tags, publication.tags || defaultTags);
                // await fillMultipleInputs(page, {
                //   title: publication.title,
                //   price: publication.price,
                //   description: publication.description,
                //   tags: publication.tags,
                // }, 'fb');
                yield page.click(inputRefs.categorySelect);
                // selecting electronic product category
                yield page.evaluate(() => {
                    document.querySelectorAll('.jxo0map8')[15].click();
                });
                yield page.click(inputRefs.nextButton);
                yield page.waitForTimeout(3000);
                // selecting all groups to publish the product
                yield page.evaluate(() => {
                    Array.from(document.querySelectorAll('.j83agx80 .hu5pjgll.lzf7d6o1')).forEach((item) => item && item.click());
                });
                // publishing the article
                yield page.click(inputRefs.publishButton);
                yield page.waitForNavigation();
                yield page.waitForTimeout(1000);
                // await page.waitForNetworkIdle();
                // await page.evaluate(() =>
                // (document.querySelectorAll('[aria-label="M??s"]')[2] as any).click());
                // await page.waitForTimeout(2000);
                // await page.click(inputRefs.publishedItemListImg);
                // await page.waitForNetworkIdle();
                // await page.waitForTimeout(1000);
                //
                // const publicationUrl: string = (
                // await page.$eval(inputRefs.itemLink, (item: any) => item.href)) || '';
                //
                // // extracting the publicationID from the publicationUrl.split('/')
                // const publicationId = publicationUrl ?
                // publicationUrl.split('/')[publicationUrl.split('/').length - 2] : 0;
                if (pubIndex === publications.length - 1) {
                    // responseData.push({ url: publicationUrl, id: publicationId });
                    pubIndex = 0;
                    index_1.SocketIoServer.emit(enums_1.EcommerceEvents.EMIT_PUBLISHED, new common_1.ECommerceResponse({
                        publication,
                        status: 'published',
                        ecommerce: ecommerce_1.availableEcommerce.facebook,
                    }));
                    index_1.SocketIoServer.emit(enums_1.EcommerceEvents.EMIT_COMPLETED, new common_1.ECommerceResponse({
                        publication,
                        status: 'completed',
                        ecommerce: ecommerce_1.availableEcommerce.facebook,
                    }));
                    browser.close();
                }
                else {
                    pubIndex += 1;
                    index_1.SocketIoServer.emit(enums_1.EcommerceEvents.EMIT_PUBLISHED, new common_1.ECommerceResponse({
                        publication,
                        status: 'published',
                        ecommerce: ecommerce_1.availableEcommerce.facebook,
                    }));
                    (0, exports.publishInMarketplace)(publications, page, browser);
                }
            }
            catch (err) {
                console.log('Error Second Try Catch: ', err);
                (0, errors_1.handlePublicationError)(err, ecommerce_1.availableEcommerce.facebook, () => (0, exports.publishInMarketplace)(publications, page, browser), browser);
            }
        }));
    }
    catch (err) {
        console.log('Error First Try Catch: ', err);
        (0, errors_1.handlePublicationError)(err, ecommerce_1.availableEcommerce.facebook, () => (0, exports.publishInMarketplace)(publications, page, browser), browser);
    }
});
exports.publishInMarketplace = publishInMarketplace;
// {
//   "_id":"61b0c6893aca9300088f4dc7",
//     "description":"ESPECIFICACIONES:\n-Compatible con iOS y Android\n-Recibe y realiza llamadas\n-Notifica redes sociales\n-Corona usca tel??fono m??vil, interruptor de modo dual, m??sica Bluetooth",
//     "name":"Bocina Bluetooth Aprueba de Agua ",
//     "GodWord":"Sonr??e, Jes??s te ama",
//     "price":3095,
//     "cost":1820,
//     "productImage":"https://storage.googleapis.com/betuel-tech-photos/flyer-1641924091994.png",
//     "image":"https://storage.googleapis.com/betuel-tech-photos/flyer-1641924091994.png",
//     "flyerOptions":"{\"width\":277,\"height\":354,\"x\":114,\"y\":23,\"fontSize\":37}",
//     "__v":0
// },
// {
//   "_id":"61b0c6893aca9300088f4dc7",
//     "description":"ESPECIFICACIONES:\n-Compatible con iOS y Android\n-Recibe y realiza llamadas\n-Notifica redes sociales\n-Corona usca tel??fono m??vil, interruptor de modo dual, m??sica Bluetooth",
//     "name":"Bocina Bluetooth Aprueba de Agua ",
//     "GodWord":"Sonr??e, Jes??s te ama",
//     "price":3095,
//     "cost":1820,
//     "productImage":"https://storage.googleapis.com/betuel-tech-photos/flyer-1641924091994.png",
//     "image":"https://storage.googleapis.com/betuel-tech-photos/flyer-1641924091994.png",
//     "flyerOptions":"{\"width\":277,\"height\":354,\"x\":114,\"y\":23,\"fontSize\":37}",
//     "__v":0
// }
//# sourceMappingURL=facebookService.js.map