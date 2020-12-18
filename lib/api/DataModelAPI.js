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
exports.DataModelAPI = void 0;
const BaseAPI_1 = require("./BaseAPI");
class DataModelAPI extends BaseAPI_1.BaseAPI {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.clearAllDataModels();
            yield this.syncModels(this.cwire.getDataModelsList());
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
                responses.push(this.api.post("/models", Object.assign(Object.assign({}, model.toJSON()), { worker: worker.name })));
            }
            try {
                return yield Promise.all(responses);
            }
            catch (err) {
                if (err.response) {
                    console.log(err.response.data);
                }
                return;
            }
        });
    }
    clearAllDataModels() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.post("/models/clear");
        });
    }
    getAllDataModels() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.api.get("/models");
        });
    }
}
exports.DataModelAPI = DataModelAPI;
//# sourceMappingURL=DataModelAPI.js.map