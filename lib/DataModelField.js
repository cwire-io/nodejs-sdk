"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModelField = void 0;
const CWire_1 = require("./CWire");
const references_1 = require("./constants/references");
const errors_1 = require("./errors");
class DataModelField {
    constructor(name, options) {
        this.displayName = null;
        this.reference = null;
        this.name = name;
        if (!DataModelField.isValidFieldType(options.type)) {
            throw new errors_1.WrongFieldTypeError();
        }
        if (options.reference &&
            DataModelField.isValidFieldReference(options.reference)) {
            this.reference = {
                type: options.reference.type,
                field: options.reference.field,
                model: options.reference.model,
            };
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
    setDisplayName(displayName) {
        this.displayName = displayName;
    }
    setReference(reference) {
        if (!DataModelField.isValidFieldReference(reference)) {
            throw new errors_1.WrongFieldReferenceError();
        }
        this.reference = reference;
    }
    getReference() {
        if (!this.reference) {
            return null;
        }
        return {
            type: this.reference.type,
            model: this.reference.model,
            field: this.reference.field,
        };
    }
    toJSON() {
        return Object.assign({ name: this.name, type: this.type, reference: this.reference
                ? {
                    type: this.reference.type,
                    model: this.reference.model,
                    field: this.reference.field,
                }
                : null, isPrimary: this.isPrimary }, (typeof this.displayName === 'string'
            ? { displayName: this.displayName }
            : {}));
    }
    isPrimaryField() {
        return this.isPrimary;
    }
    static isValidFieldReference(reference) {
        if (typeof reference !== 'object' || !reference)
            return false;
        const { type, model, field } = reference;
        return (typeof model === 'string' &&
            typeof field === 'string' &&
            references_1.REFERENCE_TYPES[type]);
    }
    static isValidFieldType(type) {
        if (typeof type !== 'string')
            return false;
        return !!CWire_1.CWire.FIELD_TYPES[type.toUpperCase()];
    }
}
exports.DataModelField = DataModelField;
//# sourceMappingURL=DataModelField.js.map