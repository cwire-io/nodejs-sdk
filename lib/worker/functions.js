"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerFunctions = void 0;
var findAll_1 = require("./functions/findAll");
var findOne_1 = require("./functions/findOne");
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
        // Init worker Functions
        this.instance.addFunction(findAll_1.FindAll);
        this.instance.addFunction(findOne_1.FindOne);
        return this.instance;
    };
    WorkerFunctions.getInstance = function () {
        return this.instance;
    };
    return WorkerFunctions;
}());
exports.WorkerFunctions = WorkerFunctions;
