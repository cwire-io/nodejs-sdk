"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModel = void 0;
var errors_1 = require("./errors");
var DataModelField_1 = require("./DataModelField");
var DataModelAction_1 = require("./DataModelAction");
var DataModel = /** @class */ (function () {
    function DataModel(name, options) {
        this.id = null;
        this.fields = {};
        this.actions = {};
        if (!name) {
            throw new errors_1.MissingRequiredPropertyError();
        }
        this.name = name;
        this.options = options;
        if (options.fields) {
            if (Array.isArray(options.fields)) {
                for (var _i = 0, _a = options.fields; _i < _a.length; _i++) {
                    var field = _a[_i];
                    this.fields[field.getName()] = field;
                }
            }
            else {
                for (var _b = 0, _c = Object.keys(options.fields); _b < _c.length; _b++) {
                    var fieldName = _c[_b];
                    this.fields[fieldName] = new DataModelField_1.DataModelField(fieldName, options.fields[fieldName]);
                }
            }
        }
        if (options.actions) {
            if (Array.isArray(options.actions)) {
                for (var _d = 0, _e = options.actions; _d < _e.length; _d++) {
                    var action = _e[_d];
                    this.actions[action.getName()] = action;
                }
            }
            else {
                for (var _f = 0, _g = Object.keys(options.actions); _f < _g.length; _f++) {
                    var actionName = _g[_f];
                    this.actions[actionName] = new DataModelAction_1.DataModelAction(actionName, options.actions[actionName]);
                }
            }
        }
    }
    DataModel.prototype.changeByObject = function (obj) { };
    DataModel.prototype.getName = function () {
        return this.name;
    };
    DataModel.prototype.getId = function () {
        return this.id;
    };
    DataModel.prototype.setId = function (newId) {
        this.id = newId;
    };
    DataModel.prototype.getOptions = function () {
        return this.options;
    };
    DataModel.prototype.toJSON = function () {
        return {
            id: this.getId(),
            name: this.getName(),
            fields: this.getFieldsList().map(function (field) { return field.toJSON(); }),
            actions: this.getActionsList().map(function (action) { return action.toJSON(); }),
        };
    };
    DataModel.prototype.getActionsMap = function () {
        return this.actions;
    };
    DataModel.prototype.getActionsList = function () {
        return Object.values(this.actions);
    };
    DataModel.prototype.isActionExist = function (name) {
        return !!this.actions[name];
    };
    DataModel.prototype.getActionByName = function (name) {
        if (!this.isActionExist(name)) {
            throw new errors_1.DataModelActionNotFoundError();
        }
        return this.actions[name];
    };
    DataModel.prototype.getFieldsMap = function () {
        return this.fields;
    };
    DataModel.prototype.getFieldsList = function () {
        return Object.values(this.fields);
    };
    DataModel.prototype.isFieldExist = function (name) {
        return !!this.fields[name];
    };
    DataModel.prototype.getFieldByName = function (name) {
        if (!this.isFieldExist(name)) {
            throw new errors_1.DataModelFieldNotFoundError();
        }
        return this.fields[name];
    };
    return DataModel;
}());
exports.DataModel = DataModel;
