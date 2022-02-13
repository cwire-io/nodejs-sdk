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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CWire = void 0;
const axios_1 = __importDefault(require("axios"));
const CWireAPI_1 = require("./CWireAPI");
const logger_1 = __importDefault(require("./helper/logger"));
const functions_1 = require("./worker/functions");
const CWireWebSocket_1 = require("./CWireWebSocket");
const logger_2 = require("./constants/logger");
const errors_1 = require("./errors");
class CWire {
    constructor(apiKey, options = {}) {
        this.models = {};
        this.cwireRoute = '/cwire';
        this.cwireAPIURL = 'https://api.cwire.io';
        this.apiKey = apiKey;
        if (options.logger) {
            logger_1.default.setLogLevel(options.logger);
        }
        if (options.apiURL) {
            this.cwireAPIURL = options.apiURL;
        }
        if (options.route) {
            this.cwireRoute = options.route;
        }
        if (options.models) {
            for (const model of options.models) {
                this.models[model.getName()] = model;
            }
        }
        this.workerFunctions = functions_1.WorkerFunctions.init(this);
        this.websocket = new CWireWebSocket_1.CWireWebSocket(this);
        this.api = new CWireAPI_1.CWireAPI(this, axios_1.default.create({
            timeout: 10000,
            baseURL: this.cwireAPIURL,
            headers: { 'X-API-KEY': this.apiKey },
        }));
    }
    static init(apiKey, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.instance) {
                try {
                    this.instance = new CWire(apiKey, options);
                    yield this.instance.constructReferences();
                    yield this.instance.api.init();
                    yield this.instance.websocket.connect();
                }
                catch (err) {
                    this.instance && this.instance.websocket.disconnect();
                    delete this.instance;
                    this.instance = null;
                    throw err;
                }
            }
            return this.instance;
        });
    }
    constructReferences() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nativeModels = {};
                for (const model of this.getDataModelsList()) {
                    nativeModels[model.getName()] = model;
                }
                for (const model of this.getDataModelsList()) {
                    yield model.constructReferences(this, nativeModels);
                }
            }
            catch (error) {
                logger_1.default.error(logger_2.CONSTRUCT_REFERENCES_LOGGER_PREFIX, `Failed to construct field references ${error.toString()}`);
            }
        });
    }
    getAPIURL() {
        return this.cwireAPIURL;
    }
    getAPIKey() {
        return this.apiKey;
    }
    getAPI() {
        return this.api;
    }
    getWorker() {
        return this.worker;
    }
    setWorker(worker) {
        this.worker = worker;
    }
    getWorkerFunctions() {
        return this.workerFunctions;
    }
    getAxios() {
        return this.api.getAxios();
    }
    getDataModelsMap() {
        return this.models;
    }
    getDataModelsList() {
        return Object.values(this.models);
    }
    isDataModelExists(name) {
        return !!this.models[name];
    }
    static getInstance() {
        if (!this.instance) {
            throw new errors_1.CWireIsNotInitialised();
        }
        return this.instance;
    }
    getDataModelByName(name) {
        if (!this.isDataModelExists(name)) {
            throw new errors_1.DataModelNotFoundError();
        }
        return this.models[name];
    }
    static dispatch(modelName, entityId, type, options = {}) {
        if (!this.getInstance()) {
            return new errors_1.CWireIsNotInitialised();
        }
        return this.getInstance()
            .getDataModelByName(modelName)
            .addEntityEvent(entityId, type, options);
    }
}
exports.CWire = CWire;
CWire.instance = null;
CWire.FIELD_TYPES = {
    TEXT: 'text',
    NUMBER: 'number',
    CUSTOM: 'custom',
    BOOLEAN: 'boolean',
    OBJECTID: 'objectId',
    EMAIL: 'email',
    PASSWORD: 'password',
    DESCRIPTION: 'description',
    DATE: 'date',
    DATETIME: 'dateTime',
    TIMESTAMP: 'timestamp',
};
//# sourceMappingURL=CWire.js.map