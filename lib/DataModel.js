"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModel = exports.defaultOptions = void 0;
const errors_1 = require("./errors");
exports.defaultOptions = {
    isEditable: true,
    isDeletable: true,
    isCreatable: true,
    useEntityHistory: true,
};
class DataModel {
    constructor(name, options) {
        this.id = null;
        this.references = {};
        this.fields = {};
        this.actions = {};
        if (!name) {
            throw new errors_1.MissingRequiredPropertyError();
        }
        this.name = name;
        this.options = options;
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
            isEditable: this.getOptions().isEditable,
            isCreatable: this.getOptions().isCreatable,
            isDeletable: this.getOptions().isDeletable,
            fields: this.getFieldsList().map((field) => field.toJSON()),
            actions: this.getActionsList().map((action) => action.toJSON()),
        };
    }
    getModelReferenceField(model) {
    }
    sync(model) {
        for (const reference of model.references) {
            this.references[reference.model] = {
                field: reference.field,
                referenceField: reference.modelField,
            };
        }
    }
    getReferences() {
        return this.references;
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
//# sourceMappingURL=DataModel.js.map