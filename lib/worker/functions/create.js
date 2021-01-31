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
exports.Create = void 0;
const logger_1 = require("../../constants/logger");
const WorkerFunction_1 = require("../WorkerFunction");
class Create extends WorkerFunction_1.WorkerFunction {
    controller(modelName, values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataModel = this.cwire.getDataModelByName(modelName);
                const entity = yield dataModel.create(this.cwire, values);
                this.cwire
                    .getLogger()
                    .system(logger_1.CREATE_ENTITY_LOGGER_PREFIX, `Created new ${modelName} entity: ${JSON.stringify(entity)}`);
                return {
                    success: true,
                    data: entity,
                };
            }
            catch (err) {
                this.cwire
                    .getLogger()
                    .error(logger_1.CREATE_ENTITY_LOGGER_PREFIX, `Error on entity creation: ${err.toString()}`);
                return { success: false, error: err };
            }
            return { success: true, data: null };
        });
    }
    getName() {
        return 'DATA_MODEL::CREATE';
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
                name: 'values',
                type: 'values',
                isRequired: true,
            },
        ];
    }
}
exports.Create = Create;
//# sourceMappingURL=create.js.map