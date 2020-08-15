"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerFunctions = void 0;
var getEntities_1 = require("./functions/getEntities");
var WorkerFunctions = /** @class */ (function () {
    function WorkerFunctions(cwire) {
        this.functions = new Map();
        this.cwire = cwire;
    }
    WorkerFunctions.prototype.addFunction = function (FnClass) {
        var fnInstance = new FnClass(this.cwire);
        this.functions.set(fnInstance.getName(), fnInstance);
    };
    WorkerFunctions.prototype.removeFunction = function (fnName) {
        this.functions.delete(fnName);
    };
    WorkerFunctions.prototype.isFunctionExisting = function (fnName) {
        return this.functions.has(fnName);
    };
    WorkerFunctions.prototype.getFunction = function (fnName) {
        return this.functions.get(fnName);
    };
    WorkerFunctions.prototype.getFunctionList = function () {
        return Array.from(this.functions.values());
    };
    WorkerFunctions.init = function (cwire) {
        if (!this.instance) {
            this.instance = new WorkerFunctions(cwire);
        }
        this.instance.addFunction(getEntities_1.GetEntities);
        return this.instance;
    };
    WorkerFunctions.getInstance = function () {
        return this.instance;
    };
    return WorkerFunctions;
}());
exports.WorkerFunctions = WorkerFunctions;
