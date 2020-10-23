"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerFunctions = void 0;
var findAll_1 = require("./functions/findAll");
var findOne_1 = require("./functions/findOne");
var create_1 = require("./functions/create");
var remove_1 = require("./functions/remove");
var update_1 = require("./functions/update");
var dispatch_1 = require("./functions/dispatch");
var findOrCreate_1 = require("./functions/findOrCreate");
var count_1 = require("./functions/count");
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
        this.instance.addFunction(count_1.Count);
        this.instance.addFunction(create_1.Create);
        this.instance.addFunction(remove_1.Remove);
        this.instance.addFunction(update_1.Update);
        this.instance.addFunction(findAll_1.FindAll);
        this.instance.addFunction(findOne_1.FindOne);
        this.instance.addFunction(dispatch_1.Dispatch);
        this.instance.addFunction(findOrCreate_1.FindOrCreate);
        return this.instance;
    };
    WorkerFunctions.getInstance = function () {
        return this.instance;
    };
    return WorkerFunctions;
}());
exports.WorkerFunctions = WorkerFunctions;
