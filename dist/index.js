"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIoServer = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const http_1 = __importDefault(require("http"));
const facebook_1 = __importDefault(require("./routes/facebook"));
const corotos_1 = __importDefault(require("./routes/corotos"));
const flea_1 = __importDefault(require("./routes/flea"));
const freeMarket_1 = __importDefault(require("./routes/freeMarket"));
const whatsapp_1 = __importDefault(require("./routes/whatsapp"));
const instagram_1 = __importDefault(require("./routes/instagram"));
const SocketIO = require('socket.io');
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// socket io server
exports.SocketIoServer = SocketIO(server, {
    cors: {
        origin: '*',
    },
});
exports.SocketIoServer.on('connection', (socket) => {
    console.log('hey connected');
}, (err) => {
    console.log('err', err);
    throw err;
});
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));
// app.use(express.static('public'));
app.get('/products/', (req, res) => {
    res.json({ msg: 'This is CORS-enabled for all origins!' });
});
app.use('/api/facebook', facebook_1.default);
app.use('/api/corotos', corotos_1.default);
app.use('/api/flea', flea_1.default);
app.use('/api/free-market', freeMarket_1.default);
app.use('/api/whatsapp', whatsapp_1.default);
app.use('/api/instagram', instagram_1.default);
// app.use('*', (req, res) => {
//   res.send('<h1>Welcome to your simple server! Awesome right</h1>');
// });
server.listen(process.env.PORT || 3000, () => console.log(`Server is running at port: ${process.env.PORT || 3000}`));
//# sourceMappingURL=index.js.map