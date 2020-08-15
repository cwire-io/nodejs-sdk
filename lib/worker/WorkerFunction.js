"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerFunction = exports.IWorkerFunction = void 0;
var IWorkerFunction = /** @class */ (function () {
    function IWorkerFunction() {
    }
    return IWorkerFunction;
}());
exports.IWorkerFunction = IWorkerFunction;
var WorkerFunction = /** @class */ (function () {
    function WorkerFunction(cwire) {
        this.cwire = cwire;
    }
    return WorkerFunction;
}());
exports.WorkerFunction = WorkerFunction;
