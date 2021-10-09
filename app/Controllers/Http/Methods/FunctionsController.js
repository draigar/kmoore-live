"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
class FunctionsController {
    async generateRandomNumbers(_numberToGenerate, _lengthToGenerate) {
        const randomPasswords = [];
        return randomPasswords;
    }
    async formatDate(date, format) {
        if (date === undefined || date === '') {
            return dayjs_1.default().format(format);
        }
        else {
            return dayjs_1.default(date).format(format);
        }
    }
}
exports.default = FunctionsController;
//# sourceMappingURL=FunctionsController.js.map