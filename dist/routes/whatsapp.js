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
const whatsappService_1 = require("../services/whatsappService");
const whatsappRouter = (0, express_1.Router)();
whatsappRouter.post('', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = (0, whatsappService_1.getClient)();
        console.log('starting');
        // client.on('qr', (qr) => {
        //   console.log(qr);
        //   qrcode.generate(qr, { small: true });
        // });
        const persons = [
            { number: '18294291184', name: 'Betuel Travel' },
            { number: '18094055531', name: 'Williams' },
            { number: '18493846548', name: 'Luz' },
        ];
        client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, whatsappService_1.sendMessages)(persons, 1000).then((data) => {
                res.send({ status: 'Success', data });
            });
        }));
        client.on('message', (message) => {
            if (message.body === 'ping') {
                console.log(message.from);
                message.reply('pong');
            }
        });
        client.initialize();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}));
exports.default = whatsappRouter;
//# sourceMappingURL=whatsapp.js.map