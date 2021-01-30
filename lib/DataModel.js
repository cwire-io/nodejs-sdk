"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModel = void 0;
const errors_1 = require("./errors");
class DataModel {
    constructor(name, options) {
        this.orm = null;
        this.id = null;
        this.fields = {};
        this.actions = {};
        this.model = null;
        if (!name) {
            throw new errors_1.MissingRequiredPropertyError();
        }
        this.name = name;
        this.options = options;
    }
    getORM() {
        if (!this.orm) {
            throw new Error();
        }
        return this.orm;
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
    addAction(action) {
        this.actions[action.getName()] = action;
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
    addField(field) {
        this.fields[field.getName()] = field;
    }
}
exports.DataModel = DataModel;
DataModel.DATA_MODEL_TYPES = {
    CUSTOM: 'Custom',
    MONGOOSE: 'Mongoose',
    SEQUELIZE: 'Sequelize',
};
//# sourceMappingURL=DataModel.js.map