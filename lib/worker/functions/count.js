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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Count = void 0;
const logger_1 = __importDefault(require("../../helper/logger"));
const logger_2 = require("../../constants/logger");
const WorkerFunction_1 = require("../WorkerFunction");
class Count extends WorkerFunction_1.WorkerFunction {
    controller(modelName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataModel = this.cwire.getDataModelByName(modelName);
                logger_1.default.system(logger_2.COUNT_ENTITY_LOGGER_PREFIX, `Count all ${modelName} entities with ${JSON.stringify(query)}.`);
                return { success: true, data: yield dataModel.count(this.cwire, query) };
            }
            catch (err) {
                logger_1.default.error(logger_2.COUNT_ENTITY_LOGGER_PREFIX, `Error on entity creation: ${err.toString()}`);
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