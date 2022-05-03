"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECommerceResponse = exports.CommonResponse = void 0;
class CommonResponse {
    constructor(object) {
        this.loading = false;
        this.loading = object.loading;
        this.status = object.status;
        this.error = object.error;
    }
}
exports.CommonResponse = CommonResponse;
class ECommerceResponse {
    constructor(object) {
        this.loading = false;
        this.loading = object.loading;
        this.status = object.status;
        this.ecommerce = object.ecommerce;
        this.publication = object.publication;
        this.error = object.error;
    }
}
exports.ECommerceResponse = ECommerceResponse;
//# sourceMappingURL=common.js.map