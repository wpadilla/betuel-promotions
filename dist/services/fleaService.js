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
exports.publishInFlea = void 0;
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
// const responseData: any = [];
const publishInFlea = (publications, lastPage, lastBrowser) => __awaiter(void 0, void 0, void 0, function* () {
    let page = lastPage || {};
    let browser = lastBrowser || {};
    const isHeadless = publications.length <= 5;
    const publication = publications[pubIndex];
    // /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')
    // const connectedBrowser = await puppeteer.connect({browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/3a4e607c-fa9d-4402-ad87-9da9eea7d7d5'})
    try {
        if (!lastPage) {
            browser = yield puppeteer_1.default.launch({
                // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                // userDataDir: '/Users/admin/Library/Application Support/Google/Chrome/Profile 7',
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
            });
            page = yield browser.newPage();
            /// accepting alert confirmation
            page.on('dialog', (dialog) => __awaiter(void 0, void 0, void 0, function* () {
                yield dialog.accept();
            }));
            (0, permissions_1.overridePermissions)(browser, urls_1.default.flea);
            yield page.goto(urls_1.default.fleaLogin);
            yield (0, login_1.fleaLogin)(page);
        }
        yield page.goto(urls_1.default.fleaNewPub);
        // await page.waitForNavigation();
        yield page.waitForTimeout(3000);
        // all dom refs for facebook
        const inputRefs = DOMRefs_1.refObjFromKeys.flea;
        yield page.waitForSelector(inputRefs.title);
        const whatsappURL = yield urls_1.default.getWhatsappMessageURL(`Estoy interesado en este producto "${publication.name}". ??A??n est?? disponible?  \n \n ${publication.image}`);
        // const whatsappURL = 'whatsapp';
        const productDescription = `${publication.description || publication.name} \n \n
    ???????????? Puedes pedir este producto por whatsapp presionando este enlace ???????????? \n
${whatsappURL}
    \n \n
${publication.GodWord || 'Recuerda que Jes??s te Ama'}`;
        yield page.select(inputRefs.categorySelect.selector, inputRefs.categorySelect.value);
        yield page.click(inputRefs.state);
        yield page.type(inputRefs.title, `${publication.name} | Betuel Tech`);
        yield page.type(inputRefs.description, productDescription);
        yield page.type(inputRefs.price, publication.price.toString());
        const inputFile = yield page.$(inputRefs.uploadImageFileInput);
        yield (0, download_file_1.default)(publication.image, (filePath) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // uploading photo to the form
                inputFile && (yield inputFile.uploadFile(filePath));
                yield page.waitForTimeout(3000);
                yield page.click(inputRefs.publishButton);
                yield page.waitForNavigation();
                if (pubIndex === publications.length - 1) {
                    // responseData.push({ url: publicationUrl, id: publicationId });
                    pubIndex = 0;
                    index_1.SocketIoServer.emit(enums_1.EcommerceEvents.EMIT_PUBLISHED, new common_1.ECommerceResponse({
                        publication,
                        status: 'published',
                        ecommerce: ecommerce_1.availableEcommerce.flea,
                    }));
                    index_1.SocketIoServer.emit(enums_1.EcommerceEvents.EMIT_COMPLETED, new common_1.ECommerceResponse({
                        publication,
                        status: 'completed',
                        ecommerce: ecommerce_1.availableEcommerce.flea,
                    }));
                    browser.close();
                }
                else {
                    pubIndex += 1;
                    index_1.SocketIoServer.emit(enums_1.EcommerceEvents.EMIT_PUBLISHED, new common_1.ECommerceResponse({
                        publication,
                        status: 'published',
                        ecommerce: ecommerce_1.availableEcommerce.flea,
                    }));
                    // responseData.push({ url: publicationUrl, id: publicationId });
                    (0, exports.publishInFlea)(publications, page, browser);
                }
            }
            catch (err) {
                console.log('Error Second Try Catch: ', err);
                (0, errors_1.handlePublicationError)(err, 'freeMarket', () => (0, exports.publishInFlea)(publications, page, browser), browser);
            }
        }));
    }
    catch (err) {
        console.log('Error First Try Catch: ', err);
        (0, errors_1.handlePublicationError)(err, 'freeMarket', () => (0, exports.publishInFlea)(publications, page, browser), browser);
    }
});
exports.publishInFlea = publishInFlea;
//# sourceMappingURL=fleaService.js.map