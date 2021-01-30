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
const DataModelORM_1 = require("../../DataModelORM");
const parser_1 = require("./parser");
const logger_1 = require("../../helper/logger");
class SequelizeDataModelORM extends DataModelORM_1.DataModelORM {
    constructor(model, dataModel) {
        super();
        this.model = model;
        this.dataModel = dataModel;
    }
    constructReferences(cwire, nativeModels) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const sequelizeField of Object.values(this.model.rawAttributes)) {
                try {
                    if (sequelizeField.references) {
                        const { model: modelName, key: field } = sequelizeField.references;
                        if (nativeModels[modelName] &&
                            this.dataModel.getFieldByName(sequelizeField.field)) {
                            this.dataModel.getFieldByName(sequelizeField.field).setReference({
                                field,
                                model: nativeModels[modelName].getName(),
                            });
                        }
                    }
                }
                catch (error) {
                    cwire
                        .getLogger()
                        .error(logger_1.CONSTRUCT_REFERENCES_LOGGER_PREFIX, `Failed to construct reference for ${sequelizeField.field} in ${this.dataModel.getName()} with error ${error.toString()}`);
                }
            }
        });
    }
    count(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const numberOfEntities = this.model.count(parser_1.parseDataModelQueryToSequelizeQuery(query));
            return numberOfEntities || 0;
        });
    }
    create(values) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.model.create(values);
            return parser_1.buildEntitiesResponse(this.dataModel.getFieldsList(), [entity]);
        });
    }
    findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const entities = yield this.model.findAll(parser_1.parseDataModelQueryToSequelizeQuery(query));
            return parser_1.buildEntitiesResponse(this.dataModel.getFieldsList(), entities);
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.model.findOne(parser_1.parseDataModelQueryToSequelizeQuery(query));
            if (!entity) {
                return null;
            }
            return parser_1.buildEntitiesResponse(this.dataModel.getFieldsList(), [entity]);
        });
    }
    remove(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.destroy(parser_1.parseDataModelQueryToSequelizeQuery(query));
        });
    }
    update(query, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.model.findOne(parser_1.parseDataModelQueryToSequelizeQuery(query));
            if (!entity) {
                return null;
            }
            yield entity.update(changes);
            return {
                success: true,
                data: parser_1.buildEntitiesResponse(this.dataModel.getFieldsList(), [entity]),
            };
        });
    }
    getName() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.getTableName();
        });
    }
}
exports.default = SequelizeDataModelORM;
//# sourceMappingURL=SequelizeDataModelORM.js.map