"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModelAction = exports.DataModelField = exports.DataModel = exports.CWire = void 0;
const CWire_1 = require("./CWire");
Object.defineProperty(exports, "CWire", { enumerable: true, get: function () { return CWire_1.CWire; } });
const DataModel_1 = require("./DataModel");
Object.defineProperty(exports, "DataModel", { enumerable: true, get: function () { return DataModel_1.DataModel; } });
const DataModelField_1 = require("./DataModelField");
Object.defineProperty(exports, "DataModelField", { enumerable: true, get: function () { return DataModelField_1.DataModelField; } });
const DataModelAction_1 = require("./DataModelAction");
Object.defineProperty(exports, "DataModelAction", { enumerable: true, get: function () { return DataModelAction_1.DataModelAction; } });
__exportStar(require("./orms"), exports);
exports.default = CWire_1.CWire;
//# sourceMappingURL=index.js.map