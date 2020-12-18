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
exports.Dispatch = void 0;
const WorkerFunction_1 = require("../WorkerFunction");
class Dispatch extends WorkerFunction_1.WorkerFunction {
    controller(modelName) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataModel = this.cwire.getDataModelByName(modelName);
            switch (dataModel.getType()) {
                case "Sequelize":
                    return { success: true };
                case "Mongoose":
                case "Custom":
                    return { success: true };
            }
            return { success: true, data: [] };
        });
    }
    getName() {
        return "DATA_MODEL::DISPATCH";
    }
    getParameters() {
        return [
            {
                type: "option",
                options: this.cwire.getDataModelsList().map((model) => model.getName()),
                name: "modelName",
                isRequired: true,
            },
        ];
    }
}
exports.Dispatch = Dispatch;
//# sourceMappingURL=dispatch.js.map