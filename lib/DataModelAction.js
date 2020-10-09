"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModelAction = void 0;
var CWire_1 = require("./CWire");
var errors_1 = require("./errors");
var DataModelAction = /** @class */ (function () {
    function DataModelAction(name, options) {
        this.name = name;
        if (!DataModelAction.isValidActionType(options.type)) {
            throw new errors_1.WrongActionTypeError();
        }
        this.type = options.type;
    }
    DataModelAction.prototype.getName = function () {
        return name;
    };
    DataModelAction.prototype.getType = function () {
        return this.type;
    };
    DataModelAction.prototype.toJSON = function () {
        return {
            name: this.name,
            type: this.type,
        };
    };
    DataModelAction.isValidActionType = function (type) {
        if (typeof type !== "string")
            return false;
        // @ts-ignore
        return !!CWire_1.CWire.ACTIONS[type.toUpperCase()];
    };
    return DataModelAction;
}());
exports.DataModelAction = DataModelAction;
