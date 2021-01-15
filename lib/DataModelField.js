"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModelField = void 0;
const CWire_1 = require("./CWire");
const errors_1 = require("./errors");
class DataModelField {
    constructor(name, options) {
        this.name = name;
        if (!DataModelField.isValidFieldType(options.type)) {
            throw new errors_1.WrongFieldTypeError();
        }
        this.isPrimary = !!options.isPrimary;
        this.type = options.type;
    }
    getName() {
        return this.name;
    }
    getType() {
        return this.type;
    }
    toJSON() {
        return {
            name: this.name,
            type: this.type,
            isPrimary: this.isPrimary,
        };
    }
    isPrimaryField() {
        return this.isPrimary;
    }
    static isValidFieldType(type) {
        if (typeof type !== "string")
            return false;
        return !!CWire_1.CWire.FIELD_TYPES[type.toUpperCase()];
    }
}
exports.DataModelField = DataModelField;
//# sourceMappingURL=DataModelField.js.map