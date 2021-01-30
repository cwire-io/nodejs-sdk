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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseDataModelORM = void 0;
const DataModelORM_1 = require("../../DataModelORM");
const parser_1 = require("./parser");
const logger_1 = require("../../helper/logger");
class MongooseDataModelORM extends DataModelORM_1.DataModelORM {
    constructor(model, dataModel) {
        super();
        this.model = model;
        this.dataModel = dataModel;
    }
    constructReferences(cwire, nativeModels) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const fieldName of Object.keys(this.model.schema.paths)) {
                try {
                    const ref = mongooseModel.schema.paths[fieldName].options.ref;
                    if (nativeModels[ref] && nativeModels[ref].getFieldByName('_id')) {
                        this.dataModel.getFieldByName(fieldName).setReference({
                            field: '_id',
                            model: nativeModels[ref].getName(),
                        });
                    }
                }
                catch (error) {
                    cwire
                        .getLogger()
                        .error(logger_1.CONSTRUCT_REFERENCES_LOGGER_PREFIX, `Failed to construct reference for ${fieldName} in ${this.dataModel.getName()} with error ${error.toString()}`);
                }
            }
        });
    }
    create(values) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.model.create(values);
            return parser_1.buildMongooseEntitiesResponse(this.dataModel.getFieldsList(), [
                entity,
            ]);
        });
    }
    count(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query && query.group) {
                return this.model
                    .aggregate()
                    .match(parser_1.parseDataModelQueryToMongooseQuery(query))
                    .group(query.group)
                    .exec();
            }
            return this.model.count(parser_1.parseDataModelQueryToMongooseQuery(query || {}));
        });
    }
    findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let mongooseQuery = this.model.find(parser_1.parseDataModelQueryToMongooseQuery(query));
            if (query.limit && typeof query.limit === 'number') {
                mongooseQuery = mongooseQuery.limit(query.limit);
            }
            if (query.offset && typeof query.offset === 'number') {
                mongooseQuery = mongooseQuery.skip(query.offset);
            }
            const entities = yield mongooseQuery.exec();
            return parser_1.buildMongooseEntitiesResponse(this.dataModel.getFieldsList(), entities);
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let mongooseQuery = this.model.findOne(parser_1.parseDataModelQueryToMongooseQuery(query));
            if (query.limit && typeof query.limit === 'number') {
                mongooseQuery = mongooseQuery.limit(query.limit);
            }
            if (query.offset && typeof query.offset === 'number') {
                mongooseQuery = mongooseQuery.skip(query.offset);
            }
            const entity = yield mongooseQuery.exec();
            return parser_1.buildMongooseEntitiesResponse(this.dataModel.getFieldsList(), [
                entity,
            ]);
        });
    }
    remove(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.remove(parser_1.parseDataModelQueryToMongooseQuery(query)).exec();
        });
    }
    update(query, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.model
                .update(parser_1.parseDataModelQueryToMongooseQuery(query), changes)
                .exec();
            return parser_1.buildMongooseEntitiesResponse(this.dataModel.getFieldsList(), [
                entity,
            ]);
        });
    }
    getName() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.modelName || 'unknown';
        });
    }
}
exports.MongooseDataModelORM = MongooseDataModelORM;
//# sourceMappingURL=MongooseDataModelORM.js.map