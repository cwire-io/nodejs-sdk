"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModel = exports.defaultOptions = void 0;
const CWire_1 = require("./CWire");
const errors_1 = require("./errors");
const logger_1 = __importDefault(require("./helper/logger"));
const logger_2 = require("./constants/logger");
exports.defaultOptions = {
    isEditable: true,
    isDeletable: true,
    isCreatable: true,
    useEntityHistory: false,
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
    dispatch(entityId, type, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.addEntityEvent(entityId, type, options);
        });
    }
    addEntityEvent(entityId, type, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield CWire_1.CWire.getInstance()
                    .getAPI()
                    .getDataModelAPI()
                    .addEvent(type, entityId, this.getName(), options);
                logger_1.default.system(logger_2.DATA_MODEL_ENTITY_EVENT_LOGGER_PREFIX, `Log ${type} of ${entityId}`);
            }
            catch (error) {
                logger_1.default.error(logger_2.DATA_MODEL_ENTITY_EVENT_LOGGER_PREFIX, `Error by logging ${error.toString()}`);
            }
        });
    }
}
exports.DataModel = DataModel;
//# sourceMappingURL=DataModel.js.map