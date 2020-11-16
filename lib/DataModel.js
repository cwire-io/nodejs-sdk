"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModel = void 0;
var errors_1 = require("./errors");
var DataModelField_1 = require("./DataModelField");
var DataModelAction_1 = require("./DataModelAction");
var sequelize_1 = require("./helper/sequelize");
var mongoose_1 = require("./helper/mongoose");
var DataModel = /** @class */ (function () {
    function DataModel(name, options) {
        this.id = null;
        this.fields = {};
        this.actions = {};
        this.model = null;
        this.type = "Custom";
        if (!name || !options.type) {
            throw new errors_1.MissingRequiredPropertyError();
        }
        this.name = name;
        this.options = options;
        this.type = options.type;
        switch (options.type) {
            case "Custom":
                this.initCustomDataModel(options);
                break;
            case "Mongoose":
                this.initMongooseModel(options);
                break;
            case "Sequelize":
                this.initSequelizeModel(options);
                break;
            default: {
                throw new errors_1.UnknownDataModelTypeError();
            }
        }
    }
    DataModel.prototype.initSequelizeModel = function (options) {
        this.model = options.model;
        for (var _i = 0, _a = Object.values(this.model.rawAttributes); _i < _a.length; _i++) {
            var sequelizeField = _a[_i];
            if (sequelizeField.field) {
                if (sequelizeField.primaryKey) {
                    this.primaryKey = sequelizeField.field;
                }
                this.fields[sequelizeField.field] = new DataModelField_1.DataModelField(sequelizeField.field, {
                    isPrimary: sequelizeField.primaryKey,
                    type: sequelize_1.parseSequelizeDataTypeToCWireDataType(sequelizeField.type),
                });
            }
        }
    };
    DataModel.prototype.initMongooseModel = function (options) {
        this.primaryKey = "_id";
        this.model = options.model;
        for (var _i = 0, _a = Object.keys(this.model.schema.paths); _i < _a.length; _i++) {
            var fieldName = _a[_i];
            var field = this.model.schema.paths[fieldName];
            var dataType = mongoose_1.parseMongooseSchemaToCWireDataType(field);
            if (dataType !== null) {
                this.fields[fieldName] = new DataModelField_1.DataModelField(fieldName, {
                    type: dataType,
                    isPrimary: fieldName === '_id'
                });
            }
        }
    };
    DataModel.prototype.initCustomDataModel = function (options) {
        var havePrimaryKey = false;
        if (options.fields) {
            if (Array.isArray(options.fields)) {
                for (var _i = 0, _a = options.fields; _i < _a.length; _i++) {
                    var field = _a[_i];
                    if (field.isPrimaryField()) {
                        if (havePrimaryKey) {
                            throw new errors_1.MultiplePrimaryFieldsAreNotAllowedError();
                        }
                        this.primaryKey = field.getName();
                        havePrimaryKey = true;
                    }
                    this.fields[field.getName()] = field;
                }
            }
            else {
                for (var _b = 0, _c = Object.keys(options.fields); _b < _c.length; _b++) {
                    var fieldName = _c[_b];
                    if (options.fields[fieldName].isPrimary) {
                        if (havePrimaryKey) {
                            throw new errors_1.MultiplePrimaryFieldsAreNotAllowedError();
                        }
                        this.primaryKey = fieldName;
                        havePrimaryKey = true;
                    }
                    this.fields[fieldName] = new DataModelField_1.DataModelField(fieldName, options.fields[fieldName]);
                }
            }
        }
        if (!havePrimaryKey) {
            throw new errors_1.MissingPrimaryFieldError();
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
    };
    DataModel.prototype.getName = function () {
        return this.name;
    };
    DataModel.prototype.getPrimaryKey = function () {
        return this.primaryKey;
    };
    DataModel.prototype.getId = function () {
        return this.id;
    };
    DataModel.prototype.setId = function (newId) {
        this.id = newId;
    };
    DataModel.prototype.getType = function () {
        return this.type;
    };
    DataModel.prototype.getSequelizeModel = function () {
        if (this.model === null || !this.model || this.type !== "Sequelize") {
            throw new errors_1.WrongModelDetectedError();
        }
        // @ts-ignore
        return this.model;
    };
    DataModel.prototype.getMongooseModel = function () {
        if (this.model === null || !this.model || this.type !== "Mongoose") {
            throw new errors_1.WrongModelDetectedError();
        }
        // @ts-ignore
        return this.model;
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
