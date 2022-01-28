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
const corotosService_1 = require("../services/corotosService");
const corotosRouter = (0, express_1.Router)();
corotosRouter.post('', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        yield (0, corotosService_1.publishInCorotos)([...data], res);
        // res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ err });
    }
}));
exports.default = corotosRouter;
//# sourceMappingURL=corotos.js.map