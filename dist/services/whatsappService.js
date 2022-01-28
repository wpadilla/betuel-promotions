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
exports.sendMessages = exports.getClient = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const whatsapp_web_js_1 = require("whatsapp-web.js");
let whatsappClient;
const getClient = () => {
    console.log('Getting Whatsapp Client...');
    if (whatsappClient) {
        console.log('¡Client already exist!');
        return whatsappClient;
    }
    try {
        // Path where the session data will be stored
        const SESSION_FILE_PATH = path_1.default.join(__dirname, '/../data/whatsappSession.json');
        //
        // // Load the session data if it has been previously saved
        let sessionData;
        if (fs_1.default.existsSync(SESSION_FILE_PATH)) {
            sessionData = require(SESSION_FILE_PATH);
        }
        whatsappClient = new whatsapp_web_js_1.Client({
            session: sessionData,
        });
        whatsappClient.on('authenticated', (session) => {
            console.log('AUTHENTICATED SUCCESSFULLY');
            sessionData = session;
            fs_1.default.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
                if (err) {
                    console.error(err);
                }
            });
        });
        return whatsappClient;
    }
    catch (err) {
        throw err;
    }
};
exports.getClient = getClient;
const sendMessages = (persons, delay) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = (0, exports.getClient)();
        return Promise.all(persons.map((person, order) => new Promise((resolve) => setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield client.sendMessage(`${person.number}@c.us`, `Hola ${person.name}, quiero hacer amigos, me llamo Betuel y me dicen Tech, ¿como te llamas?`);
                resolve({ status: 'success', person });
            }
            catch (err) {
                resolve({ status: 'fail', person, error: err.message });
            }
        }), delay * order))));
    }
    catch (err) {
        throw err;
    }
});
exports.sendMessages = sendMessages;
//# sourceMappingURL=whatsappService.js.map