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
const WhatsappModels_1 = require("../models/WhatsappModels");
const whatsappRouter = (0, express_1.Router)();
whatsappRouter.post('', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { start, sessionId } = req.body;
        if (!start) {
            yield (0, whatsappService_1.logOut)();
            return res.status(200).send(new WhatsappModels_1.WhatsappResponse({ status: 'logged out' }));
        }
        index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_LOADING, new WhatsappModels_1.WhatsappResponse({ loading: true }));
        const { client, status } = yield (0, whatsappService_1.getClient)(sessionId);
        if (status !== 'starting') {
            index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_LOADING, { loading: false });
            return res.status(200).send(new WhatsappModels_1.WhatsappResponse({ status }));
        }
        client.on(enums_1.WhatsappEvents.ON_QR, (qrCode) => {
            console.log('qr code', qrCode);
            index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_QR, new WhatsappModels_1.WhatsappResponse({ qrCode }));
        });
        client.on(enums_1.WhatsappEvents.ON_DISCONNECTED, () => {
            console.log('DISCONNECTED!');
        });
        client.on(enums_1.WhatsappEvents.ON_READY, () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('ready!');
            index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_READY, new WhatsappModels_1.WhatsappResponse({ status: 'ready' }));
        }));
        client.on(enums_1.WhatsappEvents.ON_MESSAGE, (message) => {
            if (message.body === 'ping') {
                message.reply('pong');
            }
        });
        index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_LOADING, new WhatsappModels_1.WhatsappResponse({ loading: true }));
        client.initialize().then(() => {
            index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_LOADING, new WhatsappModels_1.WhatsappResponse({ loading: false }));
        });
        res.status(200).send(new WhatsappModels_1.WhatsappResponse({ status }));
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
whatsappRouter.post('/message', (req, res) => {
    try {
        const { contacts, sessionId, message } = req.body;
        index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_LOADING, { loading: true });
        (0, whatsappService_1.sendMessages)(sessionId, contacts, message, 5000).then((data) => {
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