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
exports.facebookLogin = void 0;
const credentials_1 = require("../utils/credentials");
const facebookLogin = (page) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.waitForTimeout(3000);
    yield page.waitForSelector('#email');
    yield page.type('#email', credentials_1.credentials.fbCredentials.email);
    yield page.type('#pass', credentials_1.credentials.fbCredentials.pass);
    return yield Promise.all([
        page.click('button[type="submit"]'),
        page.waitForNetworkIdle(),
    ]);
});
exports.facebookLogin = facebookLogin;
