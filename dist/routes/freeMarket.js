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
const freeMarketService_1 = require("../services/freeMarketService");
const freeMarketRouter = (0, express_1.Router)();
freeMarketRouter.post('', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        yield (0, freeMarketService_1.publishInFreeMarket)([...data], res);
    }
    catch (err) {
        res.status(500).json({ err });
    }
}));
exports.default = freeMarketRouter;
//# sourceMappingURL=freeMarket.js.map