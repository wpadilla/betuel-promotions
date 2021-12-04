"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overridePermissions = void 0;
const overridePermissions = (browser, url, permissions = ['geolocation', 'notifications']) => {
    const context = browser.defaultBrowserContext();
    context.overridePermissions(url, permissions);
};
exports.overridePermissions = overridePermissions;
