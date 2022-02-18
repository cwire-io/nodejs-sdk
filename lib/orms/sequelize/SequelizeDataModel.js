"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeType = void 0;
const CWire_1 = require("../../CWire");
const DataModelField_1 = require("../../DataModelField");
const logger_1 = __importStar(require("../../helper/logger"));
const DataModel_1 = require("../../DataModel");
const entity_1 = require("./entity");
const query_1 = require("./query");
const field_1 = require("./field");
const logger_2 = require("../../constants/logger");
const errors_1 = require("../../errors");
exports.SequelizeType = 'Sequelize';
class SequelizeDataModel extends DataModel_1.DataModel {
    constructor(model, options = Object.assign({}, DataModel_1.defaultOptions)) {
        super(model.getTableName(), {});
        this.model = model;
        for (const sequelizeField of Object.values(this.model.rawAttributes)) {
            if (sequelizeField.field) {
                if (sequelizeField.primaryKey) {
                    this.primaryKey = sequelizeField.field;
                }
                const fieldOptions = {
                    isPrimary: sequelizeField.primaryKey,
                    type: field_1.parseSequelizeDataTypes(sequelizeField.type),
                };
                this.fields[sequelizeField.field] = new DataModelField_1.DataModelField(sequelizeField.field, fieldOptions);
            }
        }
        if (!model.prototype.dispatch) {
            const context = this;
            model.prototype.dispatch = function (type, eventOptions = {}) {
                return context.addEntityEvent(this.get(context.getPrimaryKey()), type, eventOptions);
            };
        }
        if (options.useEntityHistory) {
            this.model.addHook('beforeBulkDestroy', (options) => {
                options.individualHooks = true;
                return options;
            });
            this.model.addHook('afterUpdate', (entity) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const changes = {};
                    for (const key of entity._changed.keys()) {
                        changes[key] = entity.get(key);
                    }
                    yield CWire_1.CWire.getInstance()
                        .getAPI()
                        .getDataModelAPI()
                        .addEvent('UPDATED', `${entity.get(this.getPrimaryKey())}`, this.getName(), {
                        after: entity.dataValues,
                        before: entity._previousDataValues,
                    });
                    logger_1.default.system(logger_2.DATA_MODEL_ENTITY_UPDATED_EVENT_LOGGER_PREFIX, `Log updating of ${this.getName()} entity ${entity.get(this.getPrimaryKey())}`);
                }
                catch (error) {
                    logger_1.default.error(logger_2.DATA_MODEL_ENTITY_UPDATED_EVENT_LOGGER_PREFIX, `Error by logging ${error.toString()}`);
                }
            }));
            this.model.addHook('afterCreate', (entity) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield CWire_1.CWire.getInstance()
                        .getAPI()
                        .getDataModelAPI()
                        .addEvent('CREATED', `${entity.get(this.getPrimaryKey())}`, this.getName(), {
                        after: entity,
                    });
                    logger_1.default.system(logger_2.DATA_MODEL_ENTITY_CREATED_EVENT_LOGGER_PREFIX, `Log creating of ${this.getName()} entity ${entity.get(this.getPrimaryKey())}`);
                }
                catch (error) {
                    logger_1.default.error(logger_2.DATA_MODEL_ENTITY_CREATED_EVENT_LOGGER_PREFIX, `Error by logging ${error.toString()}`);
                }
            }));
            this.model.addHook('beforeDestroy', (entity) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield CWire_1.CWire.getInstance()
                        .getAPI()
                        .getDataModelAPI()
                        .addEvent('DELETED', `${entity.get(this.getPrimaryKey())}`, this.getName(), {
                        before: entity.dataValues,
                    });
                    logger_1.default.system(logger_2.DATA_MODEL_ENTITY_DELETED_EVENT_LOGGER_PREFIX, `Log deleting of ${entity.get(this.getPrimaryKey())}`);
                }
                catch (error) {
                    logger_1.default.error(logger_2.DATA_MODEL_ENTITY_CREATED_EVENT_LOGGER_PREFIX, `Error by logging ${error.toString()}`);
                }
            }));
        }
    }
    static parse(models, options = Object.assign({}, DataModel_1.defaultOptions)) {
        return models.map((model) => new SequelizeDataModel(model, options));
    }
    getName() {
        return this.model.getTableName();
    }
    getType() {
        return exports.SequelizeType;
    }
    constructReferences(cwire, nativeModels) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const sequelizeField of Object.values(this.model.rawAttributes)) {
                try {
                    if (sequelizeField.references) {
                        const { model: modelName, key: field } = sequelizeField.references;
                        let referenceType = 'many';
                        for (const association of Object.values(this.model.associations)) {
                            if ((association.target.name || '').toUpperCase() ===
                                modelName.toUpperCase()) {
                                for (const targetAssociation of Object.values(association.target.associations)) {
                                    if (targetAssociation.target === this.model) {
                                        if (targetAssociation.constructor.name.toUpperCase() ===
                                            'HASONE') {
                                            referenceType = 'one';
                                        }
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        if (nativeModels[modelName] &&
                            this.getFieldByName(sequelizeField.field)) {
                            this.getFieldByName(sequelizeField.field).setReference({
                                field,
                                type: referenceType,
                                model: yield nativeModels[modelName].getName(),
                            });
                        }
                    }
                }
                catch (error) {
                    logger_1.default.error(logger_1.CONSTRUCT_REFERENCES_LOGGER_PREFIX, `Failed to construct reference for ${sequelizeField.field} in ${this.getName()} with error ${error.toString()}`);
                }
            }
        });
    }
    count(cwire, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const numberOfEntities = this.model.count(query_1.parseQueryToSequelize(this, query));
            return numberOfEntities || 0;
        });
    }
    create(cwire, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.model.create(values);
            return entity_1.buildEntitiesResponse(this.getFieldsList(), [entity]);
        });
    }
    findAll(cwire, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const entities = yield this.model.findAll(query_1.parseQueryToSequelize(this, query));
            return entity_1.buildEntitiesResponse(this.getFieldsList(), entities);
        });
    }
    getModel() {
        return this.model;
    }
    findOne(cwire, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedQuery = query_1.parseQueryToSequelize(this, query);
            const entity = yield this.model.findOne(parsedQuery);
            if (!entity) {
                return null;
            }
            return entity_1.buildEntitiesResponse(this.getFieldsList(), [entity]);
        });
    }
    remove(cwire, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.destroy(query_1.parseQueryToSequelize(this, query));
        });
    }
    update(cwire, query, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.model.findOne(query_1.parseQueryToSequelize(this, query));
            if (!entity) {
                return null;
            }
            yield entity.update(changes);
            return {
                success: true,
                data: entity_1.buildEntitiesResponse(this.getFieldsList(), [entity]),
            };
        });
    }
    calculate(cwire, calcFn, fieldName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const field = this.getFieldsMap()[fieldName];
            if (!field) {
                throw new errors_1.DataModelFieldNotFoundError();
            }
            if (field.getType() !== 'number' &&
                field.getType() !== 'date' &&
                field.getType() !== 'dateTime' &&
                field.getType() !== 'timestamp') {
                throw new errors_1.WrongFieldTypeError();
            }
            const sequelizeQuery = query_1.parseQueryToSequelize(this, query);
            const results = yield this.model.findAll(Object.assign(Object.assign({}, sequelizeQuery), { raw: true, attributes: [
                    ...(sequelizeQuery.group || []),
                    [
                        this.model.sequelize.fn(calcFn, this.model.sequelize.col(field.getName())),
                        'value',
                    ],
                ] }));
            if (sequelizeQuery.group) {
                return results;
            }
            return results[0].value;
        });
    }
}
exports.default = SequelizeDataModel;
//# sourceMappingURL=SequelizeDataModel.js.map