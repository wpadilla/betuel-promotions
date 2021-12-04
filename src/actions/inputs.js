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
exports.fillMultipleInputs = exports.fillInput = void 0;
const DOMRefs_1 = require("../utils/DOMRefs");
/* fillInput, fill an input */
const fillInput = (page, inputRef, value) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.type(inputRef, value);
});
exports.fillInput = fillInput;
/* fillMultipleInputs, fill multiple inputs according to the inputs values given
* @param page: Page
* @param inputValues: an object with the values to fill some form input
* @param refObjType: marketplace ref to the object with the references of the dom to each input
*  */
const fillMultipleInputs = (page, inputValues, refObjType) => __awaiter(void 0, void 0, void 0, function* () {
    // object with all references to the dom for the marketplace selected
    const domRefObj = DOMRefs_1.refObjFromKeys[refObjType];
    yield Promise.all(Object.keys(inputValues).map((inputKey) => __awaiter(void 0, void 0, void 0, function* () {
        yield page.type(domRefObj[inputKey], inputValues[inputKey]);
    })));
});
exports.fillMultipleInputs = fillMultipleInputs;
