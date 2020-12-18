"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModelAction = void 0;
const CWire_1 = require("./CWire");
const errors_1 = require("./errors");
class DataModelAction {
    constructor(name, options) {
        this.name = name;
        if (!DataModelAction.isValidActionType(options.type)) {
            throw new errors_1.WrongActionTypeError();
        }
        this.type = options.type;
    }
    getName() {
        return name;
    }
    getType() {
        return this.type;
    }
    toJSON() {
        return {
            name: this.name,
            type: this.type,
        };
    }
    static isValidActionType(type) {
        if (typeof type !== "string")
            return false;
        // @ts-ignore
        return !!CWire_1.CWire.ACTIONS[type.toUpperCase()];
    }
}
exports.DataModelAction = DataModelAction;
//# sourceMappingURL=DataModelAction.js.map