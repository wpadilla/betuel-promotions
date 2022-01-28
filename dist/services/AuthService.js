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
const { signToken } = require('../utils/jwtUtil');
const userService = require('./UserService').getInstance();
const crypto = require('crypto');
const login = ({ email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (yield userService.find({ email }))[0];
        return new Promise((resolve, reject) => {
            if (user) {
                // encrypting password received in order we can compare it with the encrypted one from the db
                crypto.pbkdf2(password, user.tempPassword, 10000, 64, 'sha1', (err, key) => {
                    const encryptedPassword = key.toString('base64');
                    if (user.password === encryptedPassword) {
                        const token = signToken({
                            userID: user.id,
                            companyID: user.companyID,
                        });
                        resolve(token);
                    }
                    reject(new Error('Email and/or Password Incorrect'));
                });
            }
            else {
                reject(new Error('Email and/or Password Incorrect'));
            }
        });
    }
    catch (err) {
        throw err;
    }
});
;
//# sourceMappingURL=AuthService.js.map