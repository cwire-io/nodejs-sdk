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
exports.SequelizeType = void 0;
const DataModel_1 = require("../../DataModel");
const DataModelField_1 = require("../../DataModelField");
const logger_1 = require("../../helper/logger");
const parser_1 = require("./parser");
exports.SequelizeType = 'Sequelize';
class SequelizeDataModel extends DataModel_1.DataModel {
    constructor(model) {
        super(model.getTableName(), {});
        this.model = model;
        for (const sequelizeField of Object.values(this.model.rawAttributes)) {
            if (sequelizeField.field) {
                if (sequelizeField.primaryKey) {
                    this.primaryKey = sequelizeField.field;
                }
                const fieldOptions = {
                    isPrimary: sequelizeField.primaryKey,
                    type: parser_1.parseSequelizeDataTypeToCWireDataType(sequelizeField.type),
                };
                this.fields[sequelizeField.field] = new DataModelField_1.DataModelField(sequelizeField.field, fieldOptions);
            }
        }
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
                        if (nativeModels[modelName] &&
                            this.getFieldByName(sequelizeField.field)) {
                            this.getFieldByName(sequelizeField.field).setReference({
                                field,
                                model: yield nativeModels[modelName].getName(),
                            });
                        }
                    }
                }
                catch (error) {
                    cwire
                        .getLogger()
                        .error(logger_1.CONSTRUCT_REFERENCES_LOGGER_PREFIX, `Failed to construct reference for ${sequelizeField.field} in ${this.getName()} with error ${error.toString()}`);
                }
            }
        });
    }
    count(cwire, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const numberOfEntities = this.model.count(parser_1.parseDataModelQueryToSequelizeQuery(query));
            return numberOfEntities || 0;
        });
    }
    create(cwire, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.model.create(values);
            return parser_1.buildEntitiesResponse(this.getFieldsList(), [entity]);
        });
    }
    findAll(cwire, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const entities = yield this.model.findAll(parser_1.parseDataModelQueryToSequelizeQuery(query));
            return parser_1.buildEntitiesResponse(this.getFieldsList(), entities);
        });
    }
    getModel() {
        return this.model;
    }
    findOne(cwire, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedQuery = parser_1.parseDataModelQueryToSequelizeQuery(query);
            const { sequelizeQuery, parsedIncludes } = parser_1.parseSequelizeIncludingParsing(cwire, this, query, parsedQuery);
            const entity = yield this.model.findOne(parsedQuery);
            if (!entity) {
                return null;
            }
            return parser_1.buildEntitiesResponse(this.getFieldsList(), [entity]);
        });
    }
    remove(cwire, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.destroy(parser_1.parseDataModelQueryToSequelizeQuery(query));
        });
    }
    update(cwire, query, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.model.findOne(parser_1.parseDataModelQueryToSequelizeQuery(query));
            if (!entity) {
                return null;
            }
            yield entity.update(changes);
            return {
                success: true,
                data: parser_1.buildEntitiesResponse(this.getFieldsList(), [entity]),
            };
        });
    }
}
exports.default = SequelizeDataModel;
//# sourceMappingURL=SequelizeDataModel.js.map