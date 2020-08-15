"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAPI = void 0;
var BaseAPI = /** @class */ (function () {
    function BaseAPI(cwire, api) {
        this.api = api;
        this.cwire = cwire;
    }
    BaseAPI.getServiceData = function (res) {
        return res.data.data;
    };
    return BaseAPI;
}());
exports.BaseAPI = BaseAPI;
