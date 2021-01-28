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
exports.FindOne = void 0;
const WorkerFunction_1 = require("../WorkerFunction");
const sequelize_1 = require("../../helper/sequelize");
const mongoose_1 = require("../../helper/mongoose");
const FIND_ONE_ENTITY_LOGGER_PREFIX = 'FIND_ONE_ENTITY_ACTION';
class FindOne extends WorkerFunction_1.WorkerFunction {
    controller(modelName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataModel = this.cwire.getDataModelByName(modelName);
            try {
                switch (dataModel.getType()) {
                    case 'Sequelize': {
                        const entity = yield dataModel
                            .getSequelizeModel()
                            .findOne(sequelize_1.parseDataModelQueryToSequelizeQuery(query));
                        if (!entity) {
                            return { success: true };
                        }
                        this.cwire
                            .getLogger()
                            .system(FIND_ONE_ENTITY_LOGGER_PREFIX, `Find one entity by sequelize: ${JSON.stringify(entity)}`);
                        return {
                            success: true,
                            data: sequelize_1.buildEntitiesResponse(dataModel.getFieldsList(), [entity]),
                        };
                    }
                    case 'Mongoose': {
                        let mongooseQuery = dataModel
                            .getMongooseModel()
                            .findOne(mongoose_1.parseDataModelQueryToMongooseQuery(query));
                        if (query.limit && typeof query.limit === 'number') {
                            mongooseQuery = mongooseQuery.limit(query.limit);
                        }
                        if (query.offset && typeof query.offset === 'number') {
                            mongooseQuery = mongooseQuery.skip(query.offset);
                        }
                        const entity = yield mongooseQuery.exec();
                        this.cwire
                            .getLogger()
                            .system(FIND_ONE_ENTITY_LOGGER_PREFIX, `Find one entity by mongoose: ${JSON.stringify(entity)}`);
                        return {
                            success: true,
                            data: mongoose_1.buildMongooseEntitiesResponse(dataModel.getFieldsList(), [
                                entity,
                            ]),
                        };
                    }
                    case 'Custom':
                        return { success: true, data: null };
                }
            }
            catch (error) {
                this.cwire
                    .getLogger()
                    .error(FIND_ONE_ENTITY_LOGGER_PREFIX, `Error on entity creation: ${error.toString()}`);
            }
            return { success: true, data: null };
        });
    }
    getName() {
        return 'DATA_MODEL::FIND_ONE';
    }
    getParameters() {
        return [
            {
                type: 'option',
                name: 'modelName',
                isRequired: true,
                options: this.cwire.getDataModelsList().map((model) => model.getName()),
            },
            {
                default: {},
                type: 'query',
                name: 'query',
                isRequired: false,
            },
        ];
    }
}
exports.FindOne = FindOne;
//# sourceMappingURL=findOne.js.map