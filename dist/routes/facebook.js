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
const facebookService_1 = require("../services/facebookService");
const common_1 = require("../models/common");
const index_1 = require("../index");
const enums_1 = require("../models/enums");
const ecommerce_1 = require("../utils/ecommerce");
const facebookRouter = (0, express_1.Router)();
facebookRouter.post('', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        (0, facebookService_1.publishInMarketplace)([...data]);
        index_1.SocketIoServer.emit(enums_1.EcommerceEvents.EMIT_PUBLISHING, new common_1.ECommerceResponse({ status: 'publishing', ecommerce: ecommerce_1.availableEcommerce.facebook }));
        res.status(200).json(new common_1.CommonResponse({ status: 'started' }));
    }
    catch (err) {
        res.status(500).json(new common_1.CommonResponse({
            error: err.message,
        }));
    }
}));
exports.default = facebookRouter;
//# sourceMappingURL=facebook.js.map