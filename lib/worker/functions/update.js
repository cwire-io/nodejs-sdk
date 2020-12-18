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
exports.Update = void 0;
const WorkerFunction_1 = require("../WorkerFunction");
const sequelize_1 = require("../../helper/sequelize");
const mongoose_1 = require("../../helper/mongoose");
class Update extends WorkerFunction_1.WorkerFunction {
    controller(modelName, query, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataModel = this.cwire.getDataModelByName(modelName);
            switch (dataModel.getType()) {
                case "Sequelize": {
                    const entity = yield dataModel
                        .getSequelizeModel()
                        .findOne(sequelize_1.parseDataModelQueryToSequelizeQuery(query));
                    if (!entity) {
                        return { success: false };
                    }
                    yield entity.update(values);
                    return {
                        success: true,
                        data: sequelize_1.buildEntitiesResponse(dataModel.getFieldsList(), [entity]),
                    };
                }
                // Fix entity returning of updated entity
                case "Mongoose": {
                    const entity = yield dataModel
                        .getMongooseModel()
                        .update(mongoose_1.parseDataModelQueryToMongooseQuery(query), values)
                        .exec();
                    return {
                        success: true,
                        data: mongoose_1.buildMongooseEntitiesResponse(dataModel.getFieldsList(), [
                            entity,
                        ]),
                    };
                }
                case "Custom":
                    return { success: true };
            }
            return { success: true, data: [] };
        });
    }
    getName() {
        return "DATA_MODEL::UPDATE";
    }
    getParameters() {
        return [
            {
                type: "option",
                options: this.cwire.getDataModelsList().map((model) => model.getName()),
                name: "modelName",
                isRequired: true,
            },
            {
                type: "query",
                name: "query",
                isRequired: true,
            },
            {
                type: "values",
                name: "values",
                isRequired: true,
            },
        ];
    }
}
exports.Update = Update;
//# sourceMappingURL=update.js.map