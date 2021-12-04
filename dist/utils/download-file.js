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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const request_1 = __importDefault(require("request"));
const downloads_folder_1 = __importDefault(require("downloads-folder"));
const downloadFile = function (uri, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        yield request_1.default.head(uri, (err, res) => __awaiter(this, void 0, void 0, function* () {
            const filenameSplit = uri.split('/') || [];
            const filename = filenameSplit[filenameSplit.length - 1];
            console.log('content-type:', res.headers['content-type']);
            console.log('content-length:', res.headers['content-length']);
            const filePath = `${(0, downloads_folder_1.default)()}/${filename}`;
            yield (0, request_1.default)(uri).pipe(fs_1.default.createWriteStream(filePath))
                .on('close', () => callback && callback(filePath));
        }));
    });
};
exports.default = downloadFile;
//# sourceMappingURL=download-file.js.map