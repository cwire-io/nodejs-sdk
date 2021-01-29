"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAPI = exports.API_LOGGER_PREFIX = void 0;
exports.API_LOGGER_PREFIX = 'API';
class BaseAPI {
    constructor(cwire, api) {
        this.api = api;
        this.cwire = cwire;
    }
    static getServiceData(res) {
        return res.data.data;
    }
}
exports.BaseAPI = BaseAPI;
//# sourceMappingURL=BaseAPI.js.map