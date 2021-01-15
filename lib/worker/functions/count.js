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
exports.Count = void 0;
const WorkerFunction_1 = require("../WorkerFunction");
const sequelize_1 = require("../../helper/sequelize");
const mongoose_1 = require("../../helper/mongoose");
class Count extends WorkerFunction_1.WorkerFunction {
    controller(modelName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataModel = this.cwire.getDataModelByName(modelName);
            switch (dataModel.getType()) {
                case 'Sequelize': {
                    const numberOfEntities = yield dataModel
                        .getSequelizeModel()
                        .count(sequelize_1.parseDataModelQueryToSequelizeQuery(query));
                    return {
                        success: true,
                        data: numberOfEntities || 0,
                    };
                }
                case 'Mongoose': {
                    if (query && query.group) {
                        const counts = yield dataModel
                            .getMongooseModel()
                            .aggregate()
                            .match(mongoose_1.parseDataModelQueryToMongooseQuery(query))
                            .group(query.group)
                            .exec();
                        return {
                            success: true,
                            data: counts,
                        };
                    }
                    else {
                        const numberOfEntities = yield dataModel
                            .getMongooseModel()
                            .count(sequelize_1.parseDataModelQueryToSequelizeQuery(query || {}));
                        return {
                            success: true,
                            data: numberOfEntities || 0,
                        };
                    }
                }
                case 'Custom':
                    return { success: true, data: null };
            }
            return { success: true, data: null };
        });
    }
    getName() {
        return 'DATA_MODEL::COUNT';
    }
    getParameters() {
        return [
            {
                type: 'option',
                isRequired: true,
                name: 'modelName',
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
exports.Count = Count;
//# sourceMappingURL=count.js.map