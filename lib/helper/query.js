"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFieldValue = void 0;
const moment_1 = __importDefault(require("moment"));
function parseFieldValue(field, value) {
    switch (field.getType()) {
        case 'date':
        case 'dateTime':
        case 'timestamp': {
            return moment_1.default(value).toDate();
        }
        default:
            return value;
    }
}
exports.parseFieldValue = parseFieldValue;
//# sourceMappingURL=query.js.map