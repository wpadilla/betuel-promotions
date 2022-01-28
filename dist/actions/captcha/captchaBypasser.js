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
const python_shell_1 = require("python-shell");
const bypass = (captchas, token) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const options = {
            args: [captchas[0].sitekey],
        };
        python_shell_1.PythonShell.run('src/actions/captcha/bypass.py', options, 
        // @ts-ignore
        (err, value) => __awaiter(void 0, void 0, void 0, function* () {
            // [, captchaKey]
            const captchaKey = value ? value[1] : '';
            console.log(err, 'err', captchaKey, 'klk');
            if (err)
                throw err;
            const solutions = [
                {
                    _vendor: captchas[0]._vendor,
                    id: captchas[0].id,
                    text: captchaKey,
                    hasSolution: true,
                },
            ];
            resolve({ solutions });
        }));
    });
});
exports.default = bypass;
//# sourceMappingURL=captchaBypasser.js.map