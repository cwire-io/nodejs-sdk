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
const bulk_1 = require("./functions/bulk");
class WorkerFunctions {
    constructor(cwire) {
        this.functions = new Map();
        this.cwire = cwire;
    }
    addFunction(fnInstance) {
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
        this.instance.addFunction(new count_1.Count(cwire));
        this.instance.addFunction(new create_1.Create(cwire));
        this.instance.addFunction(new remove_1.Remove(cwire));
        this.instance.addFunction(new update_1.Update(cwire));
        this.instance.addFunction(new findAll_1.FindAll(cwire));
        this.instance.addFunction(new findOne_1.FindOne(cwire));
        this.instance.addFunction(new dispatch_1.Dispatch(cwire));
        this.instance.addFunction(new findOrCreate_1.FindOrCreate(cwire));
        this.instance.addFunction(new bulk_1.Bulk(cwire, this.instance));
        return this.instance;
    }
    static getInstance() {
        return this.instance;
    }
}
exports.WorkerFunctions = WorkerFunctions;
//# sourceMappingURL=functions.js.map