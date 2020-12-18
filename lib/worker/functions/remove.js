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
class Remove extends WorkerFunction_1.WorkerFunction {
    controller(modelName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataModel = this.cwire.getDataModelByName(modelName);
            const primaryKey = dataModel.getPrimaryKey();
            switch (dataModel.getType()) {
                case "Sequelize": {
                    yield dataModel
                        .getSequelizeModel()
                        .destroy(sequelize_1.parseDataModelQueryToSequelizeQuery(query));
                    return { success: true };
                }
                case "Mongoose": {
                    yield dataModel
                        .getMongooseModel()
                        .remove(mongoose_1.parseDataModelQueryToMongooseQuery(query))
                        .exec();
                    return { success: true };
                }
                case "Custom":
                    return { success: true };
            }
            return { success: true, data: [] };
        });
    }
    getName() {
        return "DATA_MODEL::REMOVE";
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
        ];
    }
}
exports.Remove = Remove;
//# sourceMappingURL=remove.js.map