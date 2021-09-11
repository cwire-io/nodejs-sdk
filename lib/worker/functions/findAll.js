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
exports.FindAll = void 0;
const logger_1 = require("../../constants/logger");
const WorkerFunction_1 = require("../WorkerFunction");
class FindAll extends WorkerFunction_1.WorkerFunction {
    controller(modelName, query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataModel = this.cwire.getDataModelByName(modelName);
                const entities = yield dataModel.findAll(this.cwire, query);
                this.cwire
                    .getLogger()
                    .system(logger_1.FIND_ALL_ENTITY_LOGGER_PREFIX, `Send ${entities.length} ${dataModel} entities:`);
                return {
                    success: true,
                    data: entities,
                };
            }
            catch (error) {
                this.cwire
                    .getLogger()
                    .error(logger_1.FIND_ALL_ENTITY_LOGGER_PREFIX, error.toString());
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