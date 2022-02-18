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
exports.Average = void 0;
const logger_1 = require("../../constants/logger");
const logger_2 = __importDefault(require("../../helper/logger"));
const WorkerFunction_1 = require("../WorkerFunction");
const DataModel_1 = require("../../types/DataModel");
class Average extends WorkerFunction_1.WorkerFunction {
    controller(modelName, fieldName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataModel = this.cwire.getDataModelByName(modelName);
                const data = yield dataModel.calculate(this.cwire, DataModel_1.DataModelCalculationFunctions.AVG, fieldName, query);
                logger_2.default.system(logger_1.AVERAGE_LOGGER_PREFIX, `Run average calculation`);
                return { success: true, data };
            }
            catch (error) {
                logger_2.default.error(logger_1.AVERAGE_LOGGER_PREFIX, `Error on average calculation: ${error.toString()}`);
                return { success: false, data: null };
            }
        });
    }
    getName() {
        return 'DATA_MODEL::AVERAGE';
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
                type: 'option',
                name: 'fieldName',
                isRequired: true,
                options: this.cwire
                    .getDataModelsList()
                    .reduce((fields, model) => {
                    return [
                        ...fields,
                        ...model.getFieldsList().map((field) => field.getName()),
                    ];
                }, []),
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
exports.Average = Average;
//# sourceMappingURL=average.js.map