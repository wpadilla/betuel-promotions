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
exports.sendMessages = exports.getClient = exports.logOut = void 0;
const path_1 = __importDefault(require("path"));
const whatsapp_web_js_1 = require("whatsapp-web.js");
const index_1 = require("../index");
const enums_1 = require("../models/enums");
const WhatsappModels_1 = require("../models/WhatsappModels");
let whatsappClient = {};
// Path where the session data will be stored
const SESSION_FILE_PATH = path_1.default.join(__dirname, '/../data/whatsappSession.json');
const WS_DATA_PATH = './dist';
const logOut = () => new Promise((resolve) => {
    index_1.SocketIoServer.emit('whatsapp-loading', { loading: true });
    // fs.writeFile(SESSION_FILE_PATH, '{}', async (err) => {
    //   if (whatsappClient) {
    //     // console.log('¡Client already exist!', await whatsappClient.getState());
    //     try {
    //       await whatsappClient.logout();
    //       await whatsappClient.destroy();
    //     } catch (err: any) {
    //       console.log('error at log out', err);
    //     }
    //   }
    //   whatsappClient = undefined;
    //
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     SocketIoServer.emit('whatsapp-logged-out', { status: 'logged out' });
    //     setTimeout(() => resolve({ status: 'logged out' }), 1000);
    //   }
    //
    //   SocketIoServer.emit('whatsapp-loading', { loading: false });
    // });
});
exports.logOut = logOut;
class ClientResponse extends WhatsappModels_1.WhatsappResponse {
    constructor(data) {
        super(data);
        this.client = {};
        this.client = data.client;
    }
}
const getClient = (sessionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientId = whatsappClient[sessionId]
            && whatsappClient[sessionId].options.authStrategy.clientId;
        console.log('client id:', clientId);
        if (whatsappClient[sessionId] && whatsappClient[sessionId].info && clientId === sessionId) {
            console.log(enums_1.AppMessages.CLIENT_EXIST);
            index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_AUTH_SUCCESS, new WhatsappModels_1.WhatsappResponse({ status: 'logged' }));
            return new ClientResponse({ client: whatsappClient[sessionId], status: 'logged' });
        }
        if (whatsappClient[sessionId] && clientId === sessionId) {
            return new ClientResponse({ client: whatsappClient[sessionId], status: 'started' });
        }
        // creation of the client
        whatsappClient[sessionId] = new whatsapp_web_js_1.Client({
            // local auth to store the user data in local for multi-device whatsapp
            authStrategy: new whatsapp_web_js_1.LocalAuth({ clientId: sessionId, dataPath: WS_DATA_PATH }),
            puppeteer: {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
            },
        });
        whatsappClient[sessionId].on(enums_1.WhatsappEvents.ON_AUTHENTICATED, () => {
            console.log(enums_1.AppMessages.AUTHENTICATED);
            index_1.SocketIoServer.emit(enums_1.WhatsappEvents.EMIT_AUTH_SUCCESS, new WhatsappModels_1.WhatsappResponse({ status: 'logged' }));
        });
        whatsappClient[sessionId].on(enums_1.WhatsappEvents.ON_AUTH_FAIL, (error) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(enums_1.AppMessages.AUTHENTICATION_FAIL);
            yield (0, exports.logOut)();
            setTimeout(() => {
                index_1.SocketIoServer.emit('whatsapp-auth-fail', { error });
            }, 1000);
        }));
        return new ClientResponse({ client: whatsappClient[sessionId], status: 'starting' });
    }
    catch (err) {
        console.log(enums_1.AppMessages.ERROR_WHILE_GETTING_WS_CLIENT, err);
        throw err;
    }
});
exports.getClient = getClient;
const sendMessages = (sessionId, persons, delay) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (whatsappClient[sessionId]) {
            return Promise.all(persons.map((person, order) => new Promise((resolve) => setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield whatsappClient[sessionId].sendMessage(`1${person.number}@c.us`, `Hola ${person.firstName}, quiero hacer amigos, me llamo Betuel y me dicen Tech, ¿como te llamas?`);
                    index_1.SocketIoServer.emit('whatsapp-message-sent', person);
                    resolve({ status: 'success', person });
                }
                catch (err) {
                    index_1.SocketIoServer.emit('whatsapp-message-fail', { error: err.message });
                    resolve({ status: 'fail', person, error: err.message });
                }
            }), delay * order))));
        }
        return new Promise(() => ({ error: 'No client found' }));
    }
    catch (err) {
        throw err;
    }
});
exports.sendMessages = sendMessages;
//# sourceMappingURL=whatsappService.js.map