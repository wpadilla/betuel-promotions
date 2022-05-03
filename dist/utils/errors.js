"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePublicationError = void 0;
const index_1 = require("../index");
const enums_1 = require("../models/enums");
const common_1 = require("../models/common");
const ecommerce_1 = require("./ecommerce");
const errorsCount = {
    corotos: 0,
    facebook: 0,
    freeMarket: 0,
    flea: 0,
};
const handlePublicationError = (error, ecommerceType, retry, browser) => {
    if (errorsCount[ecommerceType] >= 3) {
        errorsCount[ecommerceType] = 0;
        browser.close();
        index_1.SocketIoServer.emit(enums_1.EcommerceEvents.EMIT_FAILED, new common_1.ECommerceResponse({
            status: 'failed',
            ecommerce: ecommerce_1.availableEcommerce.facebook,
            error: error.message,
        }));
    }
    else {
        errorsCount[ecommerceType] += errorsCount[ecommerceType] + 1;
        retry();
    }
};
exports.handlePublicationError = handlePublicationError;
//# sourceMappingURL=errors.js.map