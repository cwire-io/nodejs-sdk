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
exports.FindAll = void 0;
const WorkerFunction_1 = require("../WorkerFunction");
const sequelize_1 = require("../../helper/sequelize");
const mongoose_1 = require("../../helper/mongoose");
const FIND_ALL_ENTITY_LOGGER_PREFIX = 'FIND_ALL_ENTITIES_ACTION';
class FindAll extends WorkerFunction_1.WorkerFunction {
    controller(modelName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataModel = this.cwire.getDataModelByName(modelName);
            try {
                switch (dataModel.getType()) {
                    case 'Sequelize': {
                        const entities = yield dataModel
                            .getSequelizeModel()
                            .findAll(sequelize_1.parseDataModelQueryToSequelizeQuery(query));
                        this.cwire
                            .getLogger()
                            .system(FIND_ALL_ENTITY_LOGGER_PREFIX, `Find all entities by mongoose: ${entities}`);
                        return {
                            success: true,
                            data: sequelize_1.buildEntitiesResponse(dataModel.getFieldsList(), entities),
                        };
                    }
                    case 'Mongoose': {
                        let mongooseQuery = dataModel
                            .getMongooseModel()
                            .find(mongoose_1.parseDataModelQueryToMongooseQuery(query));
                        if (query.limit && typeof query.limit === 'number') {
                            mongooseQuery = mongooseQuery.limit(query.limit);
                        }
                        if (query.offset && typeof query.offset === 'number') {
                            mongooseQuery = mongooseQuery.skip(query.offset);
                        }
                        const entities = yield mongooseQuery.exec();
                        this.cwire
                            .getLogger()
                            .system(FIND_ALL_ENTITY_LOGGER_PREFIX, `Find all entities by mongoose: ${entities}`);
                        return {
                            success: true,
                            data: mongoose_1.buildMongooseEntitiesResponse(dataModel.getFieldsList(), entities),
                        };
                    }
                    case 'Custom':
                        return { success: true, data: [] };
                }
            }
            catch (err) {
                this.cwire
                    .getLogger()
                    .error(FIND_ALL_ENTITY_LOGGER_PREFIX, `Error on entity creation: ${err.toString()}`);
            }
            return { success: true, data: [] };
        });
    }
    getName() {
        return 'DATA_MODEL::FIND_ALL';
    }
    getParameters() {
        return [
            {
                type: 'option',
                options: this.cwire.getDataModelsList().map((model) => model.getName()),
                name: 'modelName',
                isRequired: true,
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
exports.FindAll = FindAll;
//# sourceMappingURL=findAll.js.map