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
exports.FindAll = void 0;
const logger_1 = __importDefault(require("../../helper/logger"));
const logger_2 = require("../../constants/logger");
const WorkerFunction_1 = require("../WorkerFunction");
class FindAll extends WorkerFunction_1.WorkerFunction {
    controller(modelName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataModel = this.cwire.getDataModelByName(modelName);
                const entities = yield dataModel.findAll(this.cwire, query);
                logger_1.default.system(logger_2.FIND_ALL_ENTITY_LOGGER_PREFIX, `Send ${entities.length} ${dataModel} entities:`);
                return {
                    success: true,
                    data: entities,
                };
            }
            catch (error) {
                logger_1.default.error(logger_2.FIND_ALL_ENTITY_LOGGER_PREFIX, error.toString());
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