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
const FIND_ONE_ENTITY_LOGGER_PREFIX = 'FIND_ONE_ENTITY_ACTION';
class FindOne extends WorkerFunction_1.WorkerFunction {
    controller(modelName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataModel = this.cwire.getDataModelByName(modelName);
                const entity = yield dataModel.findOne(this.cwire, query);
                this.cwire
                    .getLogger()
                    .system(FIND_ONE_ENTITY_LOGGER_PREFIX, `Find one ${modelName} entity: ${JSON.stringify(entity)}`);
                return { success: true, data: entity };
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