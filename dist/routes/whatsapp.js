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
const index_1 = require("../index");
const whatsappRouter = (0, express_1.Router)();
whatsappRouter.post('', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { start } = req.body;
        if (!start) {
            yield (0, whatsappService_1.logOut)();
            return res.status(200).send({ status: 'logged out' });
        }
        const { client, initialized } = yield (0, whatsappService_1.getClient)();
        client.on('qr', (qrCode) => {
            console.log('qr', qrCode);
            index_1.SocketIoServer.emit('whatsapp-qr-code', { qrCode });
        });
        client.on('disconnected', () => {
            console.log('DISCONNECTED!');
            (0, whatsappService_1.logOut)();
        });
        client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('ready');
            index_1.SocketIoServer.emit('whatsapp-ready', { status: 'ready' });
        }));
        client.on('message', (message) => {
            if (message.body === 'ping') {
                console.log(message.from);
                message.reply('pong');
            }
        });
        index_1.SocketIoServer.emit('whatsapp-loading', { loading: true });
        if (!initialized) {
            console.log('klk initializing');
            yield client.initialize();
            index_1.SocketIoServer.emit('whatsapp-loading', { loading: false });
        }
        else {
            index_1.SocketIoServer.emit('whatsapp-loading', { loading: false });
        }
        res.status(200).send({ status: !initialized ? 'starting...' : 'started', initialized });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}));
whatsappRouter.post('/message', (req, res) => {
    try {
        console.log('contacts', req.body.contacts);
        index_1.SocketIoServer.emit('whatsapp-loading', { loading: true });
        (0, whatsappService_1.sendMessages)(req.body.contacts, 5000).then((data) => {
            index_1.SocketIoServer.emit('whatsapp-messages-end', { data });
            index_1.SocketIoServer.emit('whatsapp-loading', { loading: false });
        });
        res.status(200).send({ status: 'sending...' });
    }
    catch (error) {
        res.status(500).send({ error });
    }
});
exports.default = whatsappRouter;
//# sourceMappingURL=whatsapp.js.map