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
exports.MongooseType = void 0;
const CWire_1 = require("../../CWire");
const logger_1 = require("../../constants/logger");
const errors_1 = require("../../errors");
const DataModel_1 = require("../../types/DataModel");
const DataModel_2 = require("../../DataModel");
const logger_2 = __importStar(require("../../helper/logger"));
const field_1 = require("./field");
const entity_1 = require("./entity");
const query_1 = require("./query");
exports.MongooseType = 'Mongoose';
class MongooseDataModel extends DataModel_2.DataModel {
    constructor(model, options = Object.assign({}, DataModel_2.defaultOptions)) {
        super(model.modelName || 'unknown', {});
        if (!model.modelName) {
            throw new errors_1.MissingRequiredPropertyError();
        }
        this.model = model;
        this.primaryKey = '_id';
        const fields = field_1.parseSchema(this.model.schema);
        for (const field of fields) {
            this.fields[field.getName()] = field;
        }
        if (!model.prototype.dispatch) {
            const context = this;
            model.prototype.dispatch = function (type, eventOptions = {}) {
                return context.addEntityEvent(this[context.getPrimaryKey()], type, eventOptions);
            };
        }
        if (options.useEntityHistory) {
            const dataModel = this;
            model._middleware.pre('save', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (this.isNew) {
                            yield CWire_1.CWire.getInstance()
                                .getAPI()
                                .getDataModelAPI()
                                .addEvent('CREATED', this._id, dataModel, {
                                after: this,
                            });
                            logger_2.default.system(logger_1.DATA_MODEL_ENTITY_CREATED_EVENT_LOGGER_PREFIX, `Log creating of ${dataModel.getName()} entity ${this._id}`);
                            return;
                        }
                        yield CWire_1.CWire.getInstance()
                            .getAPI()
                            .getDataModelAPI()
                            .addEvent('UPDATED', this._id, dataModel, {
                            after: this,
                            before: this.original,
                        });
                        logger_2.default.system(logger_1.DATA_MODEL_ENTITY_CREATED_EVENT_LOGGER_PREFIX, `Log creating of ${dataModel.getName()} entity ${this._id}`);
                    }
                    catch (error) {
                        logger_2.default.error(this.isNew
                            ? logger_1.DATA_MODEL_ENTITY_CREATED_EVENT_LOGGER_PREFIX
                            : logger_1.DATA_MODEL_ENTITY_UPDATED_EVENT_LOGGER_PREFIX, `Error by logging ${error.toString()}`);
                    }
                });
            });
        }
    }
    getName() {
        return this.model.modelName || 'unknown';
    }
    getType() {
        return exports.MongooseType;
    }
    constructReferences(cwire, nativeModels) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const fieldName of Object.keys(this.model.schema.paths)) {
                try {
                    const ref = this.model.schema.paths[fieldName].options.ref;
                    if (nativeModels[ref] && nativeModels[ref].getFieldByName('_id')) {
                        this.getFieldByName(fieldName).setReference({
                            field: '_id',
                            type: 'many',
                            model: yield nativeModels[ref].getName(),
                        });
                    }
                }
                catch (error) {
                    logger_2.default.error(logger_2.CONSTRUCT_REFERENCES_LOGGER_PREFIX, `Failed to construct reference for ${fieldName} in ${this.getName()} with error ${error.toString()}`);
                }
            }
        });
    }
    create(cwire, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.model.create(values);
            return entity_1.buildMongooseEntitiesResponse(this.getFieldsList(), [entity]);
        });
    }
    count(cwire, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query && query.group) {
                const aggregation = this.model
                    .aggregate()
                    .match(query_1.parseWhereQuery(this, query === null || query === void 0 ? void 0 : query.where));
                const [field] = query.group;
                aggregation.group({ _id: `$${field}`, total: { $sum: 1 } });
                const results = yield aggregation.exec();
                const response = [];
                for (const result of results) {
                    response.push({ [field]: result._id, count: result.total });
                }
                return response;
            }
            return this.model.count(query_1.parseWhereQuery(this, (query === null || query === void 0 ? void 0 : query.where) || {}));
        });
    }
    findAll(cwire, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let mongooseQuery = this.model.find(query_1.parseWhereQuery(this, query === null || query === void 0 ? void 0 : query.where));
            if (query.limit && typeof query.limit === 'number') {
                mongooseQuery = mongooseQuery.limit(query.limit);
            }
            if (query.offset && typeof query.offset === 'number') {
                mongooseQuery = mongooseQuery.skip(query.offset);
            }
            const entities = yield mongooseQuery.exec();
            return entity_1.buildMongooseEntitiesResponse(this.getFieldsList(), entities);
        });
    }
    findOne(cwire, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let mongooseQuery = this.model.findOne(query_1.parseWhereQuery(this, query === null || query === void 0 ? void 0 : query.where));
            if (query.limit && typeof query.limit === 'number') {
                mongooseQuery = mongooseQuery.limit(query.limit);
            }
            if (query.offset && typeof query.offset === 'number') {
                mongooseQuery = mongooseQuery.skip(query.offset);
            }
            const entity = yield mongooseQuery.exec();
            return entity_1.buildMongooseEntitiesResponse(this.getFieldsList(), [entity]);
        });
    }
    remove(cwire, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.remove(query_1.parseWhereQuery(this, query === null || query === void 0 ? void 0 : query.where)).exec();
        });
    }
    update(cwire, query, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.model
                .update(query_1.parseWhereQuery(this, query === null || query === void 0 ? void 0 : query.where), changes)
                .exec();
            return entity_1.buildMongooseEntitiesResponse(this.getFieldsList(), [entity]);
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
            const id = query.group ? `$${query.group[0]}` : null;
            const aggregatedField = `$${fieldName}`;
            const aggregation = this.model
                .aggregate()
                .match(query_1.parseWhereQuery(this, query === null || query === void 0 ? void 0 : query.where));
            switch (calcFn) {
                case DataModel_1.DataModelCalculationFunctions.AVG: {
                    aggregation.group({ _id: id, value: { $avg: aggregatedField } });
                    break;
                }
                case DataModel_1.DataModelCalculationFunctions.SUM: {
                    aggregation.group({ _id: id, value: { $sum: aggregatedField } });
                    break;
                }
                case DataModel_1.DataModelCalculationFunctions.MAX: {
                    aggregation.group({ _id: id, value: { $max: aggregatedField } });
                    break;
                }
                case DataModel_1.DataModelCalculationFunctions.MIN: {
                    aggregation.group({ _id: id, value: { $min: aggregatedField } });
                    break;
                }
            }
            const results = yield aggregation.exec();
            if (query.group) {
                const response = [];
                for (const result of results) {
                    response.push({ [query.group[0]]: result._id, value: result.value });
                }
                return response;
            }
            return results[0].value;
        });
    }
}
exports.default = MongooseDataModel;
//# sourceMappingURL=MongooseDataModel.js.map