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
exports.FindOrCreate = void 0;
const WorkerFunction_1 = require("../WorkerFunction");
class FindOrCreate extends WorkerFunction_1.WorkerFunction {
    controller(modelName, values) {
        return __awaiter(this, void 0, void 0, function* () {
            return { success: true, data: [] };
        });
    }
    getName() {
        return 'DATA_MODEL::FIND_OR_CREATE';
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
                name: 'query',
                type: 'query',
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
exports.FindOrCreate = FindOrCreate;
//# sourceMappingURL=findOrCreate.js.map