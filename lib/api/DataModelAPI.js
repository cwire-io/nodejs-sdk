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
exports.DataModelAPI = void 0;
const logger_1 = __importDefault(require("../helper/logger"));
const api_1 = require("../helper/api");
const logger_2 = require("../constants/logger");
const BaseAPI_1 = require("./BaseAPI");
class DataModelAPI extends BaseAPI_1.BaseAPI {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.default.system(logger_2.API_LOGGER_PREFIX, 'Initialising worker data models.');
                yield this.syncModels(this.cwire.getDataModelsList());
                logger_1.default.system(logger_2.API_LOGGER_PREFIX, 'Successfully initialising worker data models.');
            }
            catch (error) {
                logger_1.default.error(logger_2.API_LOGGER_PREFIX, `Failed to initialise worker data models with the error: ${error.toString()}`);
                return error;
            }
        });
    }
    syncModels(models) {
        return __awaiter(this, void 0, void 0, function* () {
            const worker = this.cwire.getWorker();
            if (!worker) {
                return;
            }
            const responses = [];
            for (const model of models) {
                responses.push((() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        logger_1.default.system(logger_2.API_LOGGER_PREFIX, `Start syncing ${model.getName()} model: ${JSON.stringify(Object.assign(Object.assign({}, model.toJSON()), { worker: worker.id }))}`);
                        const response = this.api.post('/models/', Object.assign(Object.assign({}, model.toJSON()), { worker: worker.id }));
                        logger_1.default.system(logger_2.API_LOGGER_PREFIX, `Successfully sync ${model.getName()}.`);
                        return response;
                    }
                    catch (error) {
                        logger_1.default.error(logger_2.API_LOGGER_PREFIX, `Failed to sync ${model.getName()} with the error ${error.toString()}`);
                        return error;
                    }
                }))());
            }
            try {
                yield Promise.all(responses);
                logger_1.default.system(logger_2.API_LOGGER_PREFIX, `Start sync models with api.`);
                responses.length = 0;
                for (const model of models) {
                    responses.push(this.getDataModelByName(model.getName()));
                }
                const apiModels = yield Promise.all(responses);
                for (const model of apiModels) {
                    this.cwire.getDataModelByName(model.name).sync(model);
                }
                logger_1.default.system(logger_2.API_LOGGER_PREFIX, `Successfully sync models with api.`);
            }
            catch (error) {
                if (error.response) {
                    logger_1.default.error(logger_2.API_LOGGER_PREFIX, `Failed to sync data models ${JSON.stringify(error.response.data)}`);
                }
                return error;
            }
        });
    }
    getDataModelByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return api_1.parseResponse(yield this.api.get(`/models/${name}`));
        });
    }
    addEvent(type, entityId, modelName, { icon, color, after = null, before = null, description = '', } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return api_1.parseResponse(yield this.api.post(`/models/${modelName}/entities/${entityId}/events`, {
                type,
                icon: icon || null,
                color: color || null,
                description: description || null,
                after: after && JSON.stringify(after),
                before: before && JSON.stringify(before),
            }));
        });
    }
}
exports.DataModelAPI = DataModelAPI;
//# sourceMappingURL=DataModelAPI.js.map