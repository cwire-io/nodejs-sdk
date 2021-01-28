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
exports.Remove = void 0;
const WorkerFunction_1 = require("../WorkerFunction");
const sequelize_1 = require("../../helper/sequelize");
const mongoose_1 = require("../../helper/mongoose");
const REMOVE_ENTITIES_LOGGER_PREFIX = 'REMOVE_ENTITIES_ACTION';
class Remove extends WorkerFunction_1.WorkerFunction {
    controller(modelName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataModel = this.cwire.getDataModelByName(modelName);
            const primaryKey = dataModel.getPrimaryKey();
            try {
                switch (dataModel.getType()) {
                    case 'Sequelize': {
                        const result = yield dataModel
                            .getSequelizeModel()
                            .destroy(sequelize_1.parseDataModelQueryToSequelizeQuery(query));
                        this.cwire
                            .getLogger()
                            .system(REMOVE_ENTITIES_LOGGER_PREFIX, `Remove entities by sequelize ${JSON.stringify(result)}`);
                        return { success: true };
                    }
                    case 'Mongoose': {
                        const result = yield dataModel
                            .getMongooseModel()
                            .remove(mongoose_1.parseDataModelQueryToMongooseQuery(query))
                            .exec();
                        this.cwire
                            .getLogger()
                            .system(REMOVE_ENTITIES_LOGGER_PREFIX, `Remove entities by mongoose ${JSON.stringify(result)}`);
                        return { success: true };
                    }
                    case 'Custom':
                        return { success: true };
                }
            }
            catch (error) {
                this.cwire
                    .getLogger()
                    .error(REMOVE_ENTITIES_LOGGER_PREFIX, `Error on entity creation: ${error.toString()}`);
            }
            return { success: true, data: [] };
        });
    }
    getName() {
        return 'DATA_MODEL::REMOVE';
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
                type: 'query',
                name: 'query',
                isRequired: true,
            },
        ];
    }
}
exports.Remove = Remove;
//# sourceMappingURL=remove.js.map