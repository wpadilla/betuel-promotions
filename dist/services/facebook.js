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
const permissions_1 = require("../actions/permissions");
const login_1 = require("../actions/login");
const DOMRefs_1 = require("../utils/DOMRefs");
let pubIndex = 0;
const responseData = [];
const publishInMarketplace = (publications, res, lastPage, lastBrowser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publication = publications[pubIndex];
        let page = lastPage || {};
        let browser = lastBrowser || {};
        if (!lastPage) {
            browser = yield puppeteer_1.default.launch({
                headless: false,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
            });
            page = yield browser.newPage();
            (0, permissions_1.overridePermissions)(browser, urls_1.default.facebookURL);
            yield page.goto(`${urls_1.default.facebookURL}login`);
            yield (0, login_1.facebookLogin)(page);
        }
        page.goto(urls_1.default.facebookMarketPlace);
        yield page.waitForTimeout(3000);
        // TESTING
        // await page.goto('https://www.facebook.com/marketplace/you/selling');
        // await page.waitForTimeout(3000);
        //
        // all dom refs for facebook
        const inputRefs = DOMRefs_1.refObjFromKeys.fb;
        yield page.waitForSelector(inputRefs.title);
        const inputFile = yield page.$(inputRefs.inputFIle);
        const whatsappURL = yield urls_1.default.getWhatsappMessageURL(`Estoy interesado en este producto "${publication.name}". ¿Aún está disponible?  \n \n ${publication.image}`);
        // const whatsappURL = 'whatsapp';
        const productDescription = `${publication.description || publication.name} \n \n
    👇👇👇 Puedes pedir este producto por whatsapp presionando este enlace 👇👇👇 \n
${whatsappURL}
    \n \n
     ${publication.GodWord || 'Recuerda que Jesús te Ama'}`;
        yield (0, download_file_1.default)(publication.image, (filePath) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // uploading photo to the form
                inputFile && (yield inputFile.uploadFile(filePath));
                yield page.type(inputRefs.title, publication.name);
                yield page.type(inputRefs.price, publication.price.toString());
                yield page.type(inputRefs.description, productDescription);
                yield page.type(inputRefs.tags, publication.tags || '');
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
                yield page.click(inputRefs.state);
                yield page.waitForTimeout(2000);
                // selecting Nuevo state
                yield page.evaluate(() => {
                    document.querySelectorAll('.oajrlxb2 .qzhwtbm6.knvmm38d')[1].click();
                });
                yield page.click(inputRefs.nextButton);
                yield page.waitForNetworkIdle();
                yield page.waitForTimeout(3000);
                // selecting all groups to publish the product
                yield page.evaluate(() => {
                    Array.from(document.querySelectorAll('.j83agx80 .hu5pjgll.lzf7d6o1')).forEach((item) => item && item.click());
                });
                // publishing the article
                yield page.click(inputRefs.publishButton);
                yield page.waitForNetworkIdle();
                yield page.waitForTimeout(2000);
                // await page.evaluate(() =>
                // (document.querySelectorAll('[aria-label="Más"]')[2] as any).click());
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
                    browser.close();
                    res.status(200).json({ success: true });
                }
                else {
                    pubIndex += 1;
                    // responseData.push({ url: publicationUrl, id: publicationId });
                    (0, exports.publishInMarketplace)(publications, res, page, browser);
                }
            }
            catch (err) {
                console.log('Error Second Try Catch: ', err);
                (0, exports.publishInMarketplace)(publications, res, lastPage, lastBrowser);
            }
        }));
    }
    catch (err) {
        console.log('Error First Try Catch: ', err);
        (0, exports.publishInMarketplace)(publications, res, lastPage, lastBrowser);
    }
});
exports.publishInMarketplace = publishInMarketplace;
//# sourceMappingURL=facebook.js.map