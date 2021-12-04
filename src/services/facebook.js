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
const login_1 = require("../actions/login");
const download_file_1 = __importDefault(require("../utils/download-file"));
const permissions_1 = require("../actions/permissions");
const publishInMarketplace = (publication) => {
    puppeteer_1.default.launch({
        headless: false, // put false to see how the bot work
    }).then((browser) => {
        browser.newPage().then((page) => __awaiter(void 0, void 0, void 0, function* () {
            (0, permissions_1.overridePermissions)(browser, urls_1.default.facebookURL);
            yield page.goto(`${urls_1.default.facebookURL}login`);
            yield (0, login_1.facebookLogin)(page);
            page.goto(urls_1.default.facebookMarketPlace);
            yield page.waitForTimeout(3000);
            const inputRefs = {
                title: 'label[aria-label="Título"] input',
                price: 'label[aria-label="Precio"] input',
                description: 'textarea:nth-child(1)',
                tags: 'textarea:nth-child(2)',
                categorySelect: 'label[aria-label="Categoría"]',
                state: 'label[aria-label="Estado"]',
                electronicCategory: '.jxo0map8:nth-child(16)',
                stateNew: '.oajrlxb2 .qzhwtbm6.knvmm38d:nth-child(2)',
                inputFIle: '.mkhogb32[type="file"][multiple]',
                publishButton: '[aria-label="Publicar"]',
                nextButton: '[aria-label="Siguiente"]',
            };
            // titulo
            yield page.waitForSelector(inputRefs.title);
            const inputFile = yield page.$(inputRefs.inputFIle);
            yield (0, download_file_1.default)(publication.image, (filePath) => __awaiter(void 0, void 0, void 0, function* () {
                // uploading photo to the form
                inputFile && (yield inputFile.uploadFile(filePath));
                yield page.type(inputRefs.title, publication.title);
                yield page.type(inputRefs.price, publication.price);
                yield page.type(inputRefs.description, publication.description);
                yield page.type(inputRefs.tags, publication.tags || '');
                yield page.click(inputRefs.categorySelect);
                // selecting electronic product category
                yield page.evaluate(() => {
                    document.querySelectorAll('.jxo0map8')[15].click();
                });
                yield page.click(inputRefs.state);
                yield page.waitForTimeout(2000);
                // selecting Nuevo state
                yield page.evaluate((path = 'path') => {
                    console.log(path);
                    document.querySelectorAll('.oajrlxb2 .qzhwtbm6.knvmm38d')[2].click();
                });
                yield page.click(inputRefs.nextButton);
                yield page.waitForTimeout(1000);
                // selecting all groups to publish the product
                yield page.evaluate(() => {
                    Array.from(document.querySelectorAll('.j83agx80 .hu5pjgll.lzf7d6o1')).forEach((item) => item.click());
                });
                // publishing the article
                yield page.click(inputRefs.publishButton);
            }));
        }));
    });
};
exports.publishInMarketplace = publishInMarketplace;
