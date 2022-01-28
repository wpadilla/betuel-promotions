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
const express_1 = require("express");
const Instagram = require('instagram-web-api');
const instagramRouter = (0, express_1.Router)();
const username = 'betueltech';
const password = '15282118';
instagramRouter.post('', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = new Instagram({
            username: 'betueltech',
            password: 15282118,
        });
        yield client.login();
        // const getPostPictures = async () => {
        //   await client.getPhotosByUsername({ username }).then((response: any) => console.log('response', response));
        // };
        //
        // getPostPictures();
        res.send('success');
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message });
    }
}));
exports.default = instagramRouter;
//# sourceMappingURL=instagram.js.map