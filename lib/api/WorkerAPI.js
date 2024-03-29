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
exports.WorkerAPI = void 0;
const logger_1 = __importDefault(require("../helper/logger"));
const errors_1 = require("../errors");
const api_1 = require("../helper/api");
const logger_2 = require("../constants/logger");
const BaseAPI_1 = require("./BaseAPI");
class WorkerAPI extends BaseAPI_1.BaseAPI {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.cwire.setWorker(yield this.getWorkerInfo());
                logger_1.default.system(logger_2.API_LOGGER_PREFIX, 'Fetched worker information successfully.');
            }
            catch (error) {
                logger_1.default.error(logger_2.API_LOGGER_PREFIX, `Worker api init failed with ${error.toString()}`);
            }
        });
    }
    getWorkerInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return api_1.parseResponse(yield this.api.get('/auth/api-clients/me'));
            }
            catch (err) {
                throw new errors_1.WorkerNotFound();
            }
        });
    }
}
exports.WorkerAPI = WorkerAPI;
//# sourceMappingURL=WorkerAPI.js.map