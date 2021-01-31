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
exports.CWireAPI = void 0;
const WorkerAPI_1 = require("./api/WorkerAPI");
const DataModelAPI_1 = require("./api/DataModelAPI");
class CWireAPI {
    constructor(cwire, axios) {
        this.api = axios;
        this.cwire = cwire;
        this.workerAPI = new WorkerAPI_1.WorkerAPI(cwire, axios);
        this.dataModelAPI = new DataModelAPI_1.DataModelAPI(cwire, axios);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.workerAPI.init();
                yield this.dataModelAPI.init();
            }
            catch (err) {
                console.log('API initialising failed', err);
                throw err;
            }
        });
    }
    getAxios() {
        return this.api;
    }
    getDataModelAPI() {
        return this.dataModelAPI;
    }
}
exports.CWireAPI = CWireAPI;
//# sourceMappingURL=CWireAPI.js.map