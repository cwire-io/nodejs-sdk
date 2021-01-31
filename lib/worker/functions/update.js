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
const UPDATE_ENTITIES_LOGGER_PREFIX = 'UPDATE_ENTITIES_ACTION';
class Update extends WorkerFunction_1.WorkerFunction {
    controller(modelName, query, values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataModel = this.cwire.getDataModelByName(modelName);
                const entities = yield dataModel.update(this.cwire, query, values);
                this.cwire
                    .getLogger()
                    .system(UPDATE_ENTITIES_LOGGER_PREFIX, `Update ${dataModel} entities ${JSON.stringify(entities)}`);
                return { success: true, data: entities };
            }
            catch (error) {
                this.cwire
                    .getLogger()
                    .error(UPDATE_ENTITIES_LOGGER_PREFIX, `Error on entity creation: ${error.toString()}`);
            }
            return { success: true, data: [] };
        });
    }
    getName() {
        return 'DATA_MODEL::UPDATE';
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
            {
                type: 'values',
                name: 'values',
                isRequired: true,
            },
        ];
    }
}
exports.Update = Update;
//# sourceMappingURL=update.js.map