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
exports.Bulk = void 0;
const logger_1 = require("../../constants/logger");
const logger_2 = __importDefault(require("../../helper/logger"));
const WorkerFunction_1 = require("../WorkerFunction");
class Bulk extends WorkerFunction_1.WorkerFunction {
    constructor(cwire, workerFunctions) {
        super(cwire);
        this.workerFunctions = workerFunctions;
    }
    controller(...bulk) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promises = [];
                for (const task of bulk) {
                    const workerFn = this.workerFunctions.getFunction(task.fn);
                    if (workerFn) {
                        promises.push(workerFn
                            .controller(...task.parameters)
                            .catch((error) => ({ error: true, msg: error.stack })));
                    }
                }
                logger_2.default.system(logger_1.BULK_LOGGER_PREFIX, `Run bulk actions ${JSON.stringify(bulk)}`);
                return { success: true, data: yield Promise.all(promises) };
            }
            catch (error) {
                logger_2.default.error(logger_1.BULK_LOGGER_PREFIX, `Error on entity creation: ${error.toString()}`);
                return { success: false, data: null };
            }
        });
    }
    getName() {
        return 'DATA_MODEL::BULK';
    }
    getParameters() {
        return [
            {
                type: 'group',
                name: 'functions',
                parameters: [
                    {
                        type: 'option',
                        default: null,
                        isRequired: true,
                        name: 'function',
                        options: this.workerFunctions
                            .getFunctionList()
                            .map((workerFn) => workerFn.getName()),
                    },
                    this.workerFunctions.getFunctionList().map((workerFn) => ({
                        type: 'group',
                        name: 'parameters',
                        parameters: workerFn.getParameters(),
                    })),
                ],
            },
        ];
    }
}
exports.Bulk = Bulk;
//# sourceMappingURL=bulk.js.map