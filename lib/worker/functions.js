"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerFunctions = void 0;
const findAll_1 = require("./functions/findAll");
const findOne_1 = require("./functions/findOne");
const create_1 = require("./functions/create");
const remove_1 = require("./functions/remove");
const update_1 = require("./functions/update");
const dispatch_1 = require("./functions/dispatch");
const findOrCreate_1 = require("./functions/findOrCreate");
const count_1 = require("./functions/count");
class WorkerFunctions {
    constructor(cwire) {
        this.functions = new Map();
        this.cwire = cwire;
    }
    addFunction(FnClass) {
        const fnInstance = new FnClass(this.cwire);
        this.functions.set(fnInstance.getName(), fnInstance);
    }
    removeFunction(fnName) {
        this.functions.delete(fnName);
    }
    isFunctionExisting(fnName) {
        return this.functions.has(fnName);
    }
    getFunction(fnName) {
        return this.functions.get(fnName);
    }
    getFunctionList() {
        return Array.from(this.functions.values());
    }
    static init(cwire) {
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
    }
    static getInstance() {
        return this.instance;
    }
}
exports.WorkerFunctions = WorkerFunctions;
//# sourceMappingURL=functions.js.map