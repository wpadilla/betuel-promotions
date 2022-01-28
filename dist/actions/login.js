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
exports.facebookLogin = exports.loginWithSessionFacebook = exports.isLoggedInFacebook = exports.freeMarketLogin = exports.fleaLogin = exports.corotosLogin = exports.login = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const credentials_1 = require("../utils/credentials");
const urls_1 = __importDefault(require("../utils/urls"));
const login = (page, loginCredentials, emailRef, passRef, nextStepEnable, submitButtonRef = 'button[type="submit"]') => __awaiter(void 0, void 0, void 0, function* () {
    // await page.waitForTimeout(3000);
    yield page.waitForSelector(emailRef);
    yield page.type(emailRef, loginCredentials.email);
    // if the login is of two steps
    if (nextStepEnable) {
        yield page.click(submitButtonRef);
        yield page.waitForNavigation();
        yield page.waitForTimeout(3000);
        const resCaptcha = yield page.solveRecaptchas();
        console.log('solved recaptchas!', resCaptcha);
        yield page.click(submitButtonRef);
        yield page.waitForNavigation();
        // await page.waitForTimeout(3000);
    }
    yield page.type(passRef, loginCredentials.pass);
    return Promise.all([
        page.click(submitButtonRef),
        page.waitForTimeout(3000),
        page.waitForNavigation(),
    ]);
});
exports.login = login;
const corotosLogin = (page) => __awaiter(void 0, void 0, void 0, function* () { return (0, exports.login)(page, credentials_1.credentials.corotos, '#app_user_email', '#app_user_password'); });
exports.corotosLogin = corotosLogin;
const fleaLogin = (page) => __awaiter(void 0, void 0, void 0, function* () { return (0, exports.login)(page, credentials_1.credentials.flea, '#login', '#password'); });
exports.fleaLogin = fleaLogin;
const freeMarketLogin = (page) => __awaiter(void 0, void 0, void 0, function* () { return (0, exports.login)(page, credentials_1.credentials.freeMarket, '#user_id', '#password', true); });
exports.freeMarketLogin = freeMarketLogin;
const isLoggedInFacebook = (page) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.goto(urls_1.default.facebook, {
        waitUntil: 'networkidle2',
    });
    yield page.waitForSelector('div[role=feed]');
});
exports.isLoggedInFacebook = isLoggedInFacebook;
const loginWithSessionFacebook = (cookies, page) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Logging into Facebook using cookies');
    yield page.setCookie(...cookies);
    // await page.goto(urls.facebook, { waitUntil: 'networkidle2' });
    yield (0, exports.isLoggedInFacebook)(page).catch((error) => {
        console.error('App is not logged into Facebook');
        throw error;
    });
});
exports.loginWithSessionFacebook = loginWithSessionFacebook;
const facebookLogin = (page) => __awaiter(void 0, void 0, void 0, function* () {
    // Load cookies from previous session
    const buffer = yield fs_1.default.readFileSync(path_1.default.join(__dirname, '../data/cookies.json'));
    const data = buffer.toString().replace('"use strict"', '')
        .replace('//# sourceMappingURL=cookies.js.map', '')
        .replace('//# sourceMappingURL=cookies.js.map', '')
        .replace(/[;]/gi, '');
    const cookies = data ? JSON.parse(data) : undefined;
    // Use our cookies to login. If it fails fallback to username and password login.
    if (cookies && Object.keys(cookies).length) {
        yield (0, exports.loginWithSessionFacebook)(cookies, page).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
            console.error(`Unable to login using session: ${error}`);
            yield (0, exports.login)(page, credentials_1.credentials.facebook, '#email', '#pass');
        }));
    }
    else {
        yield (0, exports.login)(page, credentials_1.credentials.facebook, '#email', '#pass');
    }
    yield page.cookies().then((freshCookies) => __awaiter(void 0, void 0, void 0, function* () {
        yield fs_1.default.writeFileSync(path_1.default.join(__dirname, '../data/cookies.json'), JSON.stringify(freshCookies, null, 2));
    }));
});
exports.facebookLogin = facebookLogin;
//# sourceMappingURL=login.js.map