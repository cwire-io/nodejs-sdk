"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModelField = void 0;
var CWire_1 = require("./CWire");
var errors_1 = require("./errors");
var DataModelField = /** @class */ (function () {
    function DataModelField(name, options) {
        this.name = name;
        if (!DataModelField.isValidFieldType(options.type)) {
            throw new errors_1.WrongFieldTypeError();
        }
        // @ts-ignore
        this.type = options.type;
    }
    DataModelField.prototype.getName = function () {
        return this.name;
    };
    DataModelField.prototype.getType = function () {
        return this.type;
    };
    DataModelField.prototype.toJSON = function () {
        return {
            name: this.name,
            type: this.type
        };
    };
    DataModelField.isValidFieldType = function (type) {
        if (typeof type !== "string")
            return false;
        // @ts-ignore
        return !!CWire_1.CWire.FIELD_TYPES[type.toUpperCase()];
    };
    return DataModelField;
}());
exports.DataModelField = DataModelField;
