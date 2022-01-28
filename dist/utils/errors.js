"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePublicationError = void 0;
const errorsCount = {
    corotos: 0,
    facebook: 0,
    freeMarket: 0,
    flea: 0,
};
const handlePublicationError = (error, res, ecommerceType, retry, browser) => {
    if (errorsCount[ecommerceType] >= 3) {
        errorsCount[ecommerceType] = 0;
        browser.close();
        res.status(500).json({ error: error.message });
    }
    else {
        errorsCount[ecommerceType] += errorsCount[ecommerceType] + 1;
        retry();
    }
};
exports.handlePublicationError = handlePublicationError;
//# sourceMappingURL=errors.js.map