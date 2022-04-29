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
const enums_1 = require("../models/enums");
const whatsappRouter = (0, express_1.Router)();
whatsappRouter.post('', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { start, clientId } = req.body;
        if (!start) {
            yield (0, whatsappService_1.logOut)();
            // return res.status(200).send({ status: 'logged out' });
        }
        index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_LOADING, { loading: true });
        const { client, initialized, logged } = yield (0, whatsappService_1.getClient)(clientId);
        if (initialized) {
            index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_LOADING, { loading: false });
            return res.status(200).send({ status: 'started', initialized, logged });
        }
        client.on(enums_1.WhatsappEvents.ON_QR, (qrCode) => {
            console.log('qr', qrCode);
            index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_QR, { qrCode });
        });
        client.on(enums_1.WhatsappEvents.ON_DISCONNECTED, () => {
            console.log('DISCONNECTED!');
            (0, whatsappService_1.logOut)();
        });
        client.on(enums_1.WhatsappEvents.ON_READY, () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('ready');
            index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_READY, { status: 'ready' });
        }));
        client.on(enums_1.WhatsappEvents.ON_MESSAGE, (message) => {
            if (message.body === 'ping') {
                message.reply('pong');
            }
        });
        index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_LOADING, { loading: true });
        yield client.initialize();
        index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_LOADING, { loading: false });
        res.status(200).send({ status: 'starting...', initialized, logged });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
}));
whatsappRouter.post('/message', (req, res) => {
    try {
        console.log('contacts', req.body.contacts);
        index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_LOADING, { loading: true });
        (0, whatsappService_1.sendMessages)(req.body.contacts, 5000).then((data) => {
            index_1.SocketIoServer.emit('whatsapp-messages-end', { data });
            index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_LOADING, { loading: false });
        });
        res.status(200).send({ status: 'sending...' });
    }
    catch (error) {
        res.status(500).send({ error });
    }
});
exports.default = whatsappRouter;
//# sourceMappingURL=whatsapp.js.map