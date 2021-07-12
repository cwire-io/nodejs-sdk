"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleEntityAction = exports.SingleEntityAction = exports.ModelAction = exports.Action = exports.DataModelAction = void 0;
const errors_1 = require("./errors");
class DataModelAction {
    constructor(...params) {
        const name = params[0];
        if (!name) {
            throw new errors_1.MissingRequiredPropertyError();
        }
        if (typeof params[1] === 'function') {
            this.name = name;
            this.type = 'one';
            this.handler = params[1];
            return;
        }
        if (typeof params[1] === 'object' && typeof params[2] === 'function') {
            this.name = name;
            this.handler = params[2];
            const _a = params[1], { type } = _a, options = __rest(_a, ["type"]);
            this.type = type;
            this.options = options;
            return;
        }
        throw new errors_1.MissingRequiredPropertyError();
    }
    getName() {
        return this.name;
    }
    getType() {
        return this.type;
    }
    getHandler() {
        return this.handler;
    }
    callHandler(...params) {
        return this.handler(...params);
    }
    toJSON() {
        return {
            name: this.name,
            type: this.type,
        };
    }
}
exports.DataModelAction = DataModelAction;
DataModelAction.ActionTypes = {
    ONE: 'one',
    NONE: 'none',
    MULTIPLE: 'multiple',
};
class Action extends DataModelAction {
}
exports.Action = Action;
class ModelAction extends DataModelAction {
    constructor(...params) {
        const name = params[0];
        if (!name) {
            throw new errors_1.MissingRequiredPropertyError();
        }
        if (typeof params[1] === 'function') {
            super(name, { type: 'none' }, params[1]);
            return;
        }
        if (typeof params[1] === 'object') {
            super(name, Object.assign({ type: 'none' }, params[1]), params[2]);
        }
        throw new errors_1.MissingRequiredPropertyError();
    }
}
exports.ModelAction = ModelAction;
class SingleEntityAction extends DataModelAction {
    constructor(...params) {
        const name = params[0];
        if (!name) {
            throw new errors_1.MissingRequiredPropertyError();
        }
        if (typeof params[1] === 'function' && typeof params[2] === 'function') {
            super(name, { type: 'one' }, params[1]);
            return;
        }
        if (typeof params[1] === 'object' && typeof params[2] === 'function') {
            super(name, Object.assign({ type: 'one' }, params[1]), params[2]);
        }
        throw new errors_1.MissingRequiredPropertyError();
    }
}
exports.SingleEntityAction = SingleEntityAction;
class MultipleEntityAction extends DataModelAction {
    constructor(...params) {
        const name = params[0];
        if (!name) {
            throw new errors_1.MissingRequiredPropertyError();
        }
        if (typeof params[1] === 'function') {
            super(name, { type: 'multiple' }, params[1]);
            return;
        }
        if (typeof params[1] === 'object') {
            super(name, Object.assign({ type: 'multiple' }, params[1]), params[2]);
        }
        throw new errors_1.MissingRequiredPropertyError();
    }
}
exports.MultipleEntityAction = MultipleEntityAction;
//# sourceMappingURL=DataModelAction.js.map