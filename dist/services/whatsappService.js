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
const fs_1 = __importDefault(require("fs"));
const whatsapp_web_js_1 = require("whatsapp-web.js");
const index_1 = require("../index");
let whatsappClient;
// Path where the session data will be stored
const SESSION_FILE_PATH = path_1.default.join(__dirname, '/../data/whatsappSession.json');
const logOut = () => new Promise((resolve) => {
    index_1.SocketIoServer.emit('whatsapp-loading', { loading: true });
    fs_1.default.writeFile(SESSION_FILE_PATH, '{}', (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (whatsappClient) {
            // console.log('¡Client already exist!', await whatsappClient.getState());
            try {
                yield whatsappClient.logout();
                yield whatsappClient.destroy();
            }
            catch (err) {
                console.log('error at log out', err);
            }
        }
        whatsappClient = undefined;
        if (err) {
            console.error(err);
        }
        else {
            index_1.SocketIoServer.emit('whatsapp-logged-out', { status: 'logged out' });
            setTimeout(() => resolve({ status: 'logged out' }), 1000);
        }
        index_1.SocketIoServer.emit('whatsapp-loading', { loading: false });
    }));
});
exports.logOut = logOut;
const getClient = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Getting Whatsapp Client...');
        if (whatsappClient && whatsappClient.info) {
            console.log('¡Client already exist!');
            return { client: whatsappClient, initialized: true };
        }
        // // Load the session data if it has been previously saved
        let sessionData;
        if (fs_1.default.existsSync(SESSION_FILE_PATH)) {
            const session = require(SESSION_FILE_PATH);
            console.log(session, 'session');
            sessionData = JSON.stringify(session) === '{}' ? undefined : session;
        }
        whatsappClient = new whatsapp_web_js_1.Client({
            session: sessionData,
        });
        whatsappClient.on('authenticated', (session) => {
            index_1.SocketIoServer.emit('whatsapp-auth-success', session);
            console.log('AUTHENTICATED SUCCESSFULLY');
            sessionData = session;
            fs_1.default.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
                if (err) {
                    console.error(err);
                }
            });
        });
        whatsappClient.on('auth_failure', (error) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('AUTHENTICATED FAIL');
            yield (0, exports.logOut)();
            setTimeout(() => {
                index_1.SocketIoServer.emit('whatsapp-auth-fail', { error });
            }, 1000);
        }));
        return { client: whatsappClient };
    }
    catch (err) {
        console.log('Error while getting client:', err);
    }
});
exports.getClient = getClient;
const sendMessages = (persons, delay) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (whatsappClient) {
            return Promise.all(persons.map((person, order) => new Promise((resolve) => setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield whatsappClient.sendMessage(`1${person.number}@c.us`, `Hola ${person.firstName}, quiero hacer amigos, me llamo Betuel y me dicen Tech, ¿como te llamas?`);
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