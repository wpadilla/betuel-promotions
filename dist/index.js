"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const facebook_1 = __importDefault(require("./routes/facebook"));
const corotos_1 = __importDefault(require("./routes/corotos"));
const flea_1 = __importDefault(require("./routes/flea"));
const freeMarket_1 = __importDefault(require("./routes/freeMarket"));
const whatsapp_1 = __importDefault(require("./routes/whatsapp"));
const instagram_1 = __importDefault(require("./routes/instagram"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
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
app.listen(process.env.PORT || 3000, () => console.log(`Server is running at port: ${process.env.PORT || 3000}`));
//# sourceMappingURL=index.js.map