"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModel = void 0;
const errors_1 = require("./errors");
const DataModelField_1 = require("./DataModelField");
const DataModelAction_1 = require("./DataModelAction");
const sequelize_1 = require("./helper/sequelize");
const mongoose_1 = require("./helper/mongoose");
class DataModel {
    constructor(name, options) {
        this.id = null;
        this.fields = {};
        this.actions = {};
        this.model = null;
        this.type = 'Custom';
        if (!name || !options.type) {
            throw new errors_1.MissingRequiredPropertyError();
        }
        this.name = name;
        this.options = options;
        this.type = options.type;
        switch (options.type) {
            case 'Custom':
                this.initCustomDataModel(options);
                break;
            case 'Mongoose':
                this.initMongooseModel(options);
                break;
            case 'Sequelize':
                this.initSequelizeModel(options);
                break;
            default: {
                throw new errors_1.UnknownDataModelTypeError();
            }
        }
    }
    initSequelizeModel(options) {
        this.model = options.model;
        for (const sequelizeField of Object.values(this.model.rawAttributes)) {
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
    }
    initMongooseModel(options) {
        this.primaryKey = '_id';
        this.model = options.model;
        for (const fieldName of Object.keys(this.model.schema.paths)) {
            const field = this.model.schema.paths[fieldName];
            const dataType = mongoose_1.parseMongooseSchemaToCWireDataType(field);
            if (dataType !== null) {
                this.fields[fieldName] = new DataModelField_1.DataModelField(fieldName, {
                    type: dataType,
                    isPrimary: fieldName === '_id',
                });
            }
        }
    }
    initCustomDataModel(options) {
        let havePrimaryKey = false;
        if (options.fields) {
            if (Array.isArray(options.fields)) {
                for (const field of options.fields) {
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
                for (const fieldName of Object.keys(options.fields)) {
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
                for (const action of options.actions) {
                    this.actions[action.getName()] = action;
                }
            }
            else {
                for (const actionName of Object.keys(options.actions)) {
                    this.actions[actionName] = new DataModelAction_1.DataModelAction(actionName, options.actions[actionName]);
                }
            }
        }
    }
    getName() {
        return this.name;
    }
    getPrimaryKey() {
        return this.primaryKey;
    }
    getId() {
        return this.id;
    }
    setId(newId) {
        this.id = newId;
    }
    getType() {
        return this.type;
    }
    getSequelizeModel() {
        if (this.model === null || !this.model || this.type !== 'Sequelize') {
            throw new errors_1.WrongModelDetectedError();
        }
        return this.model;
    }
    getMongooseModel() {
        if (this.model === null || !this.model || this.type !== 'Mongoose') {
            throw new errors_1.WrongModelDetectedError();
        }
        return this.model;
    }
    getOptions() {
        return this.options;
    }
    toJSON() {
        return {
            id: this.getId(),
            name: this.getName(),
            fields: this.getFieldsList().map((field) => field.toJSON()),
            actions: this.getActionsList().map((action) => action.toJSON()),
        };
    }
    getActionsMap() {
        return this.actions;
    }
    getActionsList() {
        return Object.values(this.actions);
    }
    isActionExist(name) {
        return !!this.actions[name];
    }
    getActionByName(name) {
        if (!this.isActionExist(name)) {
            throw new errors_1.DataModelActionNotFoundError();
        }
        return this.actions[name];
    }
    getFieldsMap() {
        return this.fields;
    }
    getFieldsList() {
        return Object.values(this.fields);
    }
    isFieldExist(name) {
        return !!this.fields[name];
    }
    getFieldByName(name) {
        if (!this.isFieldExist(name)) {
            throw new errors_1.DataModelFieldNotFoundError();
        }
        return this.fields[name];
    }
}
exports.DataModel = DataModel;
//# sourceMappingURL=DataModel.js.map