"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// app.use(express.static('public'));
app.get('/products/', (req, res) => {
    res.json({ msg: 'This is CORS-enabled for all origins!' });
});
app.use('*', (req, res) => {
    res.send('<h1>Welcome to your simple server! Awesome right</h1>');
});
app.listen(process.env.API_PORT || 8080, () => console.log(`Server is running at port: ${process.env.API_PORT || 8080}`));
//# sourceMappingURL=index.js.map