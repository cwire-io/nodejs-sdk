"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEntities = void 0;
var WorkerFunction_1 = require("../WorkerFunction");
var GetEntities = /** @class */ (function (_super) {
    __extends(GetEntities, _super);
    function GetEntities() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GetEntities.prototype.controller = function (modelName) {
        var dataModel = this.cwire.getDataModelByName(modelName);
        if (dataModel) {
            // return dataModel.getOptions().get();
        }
        return [];
    };
    GetEntities.prototype.getName = function () {
        return "getEntities";
    };
    GetEntities.prototype.getParameters = function () {
        return [{ type: 'option', options: this.cwire.getDataModelsList().map(function (model) { return model.getName(); }), name: 'modelName', isRequired: true }];
    };
    return GetEntities;
}(WorkerFunction_1.WorkerFunction));
exports.GetEntities = GetEntities;
