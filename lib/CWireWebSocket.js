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
exports.CWireWebSocket = void 0;
const perf_hooks_1 = require("perf_hooks");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const logger_1 = require("./constants/logger");
const logger_2 = __importDefault(require("./helper/logger"));
class CWireWebSocket {
    constructor(cwire) {
        this.onWorkerFunctionCalled = (functionName, params, resolve) => __awaiter(this, void 0, void 0, function* () {
            const t0 = perf_hooks_1.performance.now();
            try {
                const fn = this.cwire.getWorkerFunctions().getFunction(functionName);
                if (fn) {
                    resolve(yield fn.controller(...params));
                    return;
                }
                resolve({ error: new Error('Function not found'), success: false });
            }
            catch (err) {
                resolve({ error: err.stack, success: false });
            }
            logger_2.default.system(logger_1.FUNCTION_CALL_PERFORMANCE_LOGGER_PREFIX, `${functionName}: ${perf_hooks_1.performance.now() - t0}ms`);
        });
        this.getWorkerFunctions = (resolve) => {
            try {
                resolve(this.cwire
                    .getWorkerFunctions()
                    .getFunctionList()
                    .map((fn) => [fn.getName(), fn.getParameters()]));
            }
            catch (err) {
                console.log(err);
            }
        };
        this.cwire = cwire;
    }
    disconnect() {
        if (!this.socket)
            return;
        this.socket.disconnect();
        this.socket.close();
    }
    connect() {
        this.socket = socket_io_client_1.default(this.cwire.getAPIURL(), {
            path: '/workers/sync',
            transportOptions: {
                polling: {
                    extraHeaders: {
                        'x-access-token': this.cwire.getAPIKey(),
                    },
                },
            },
        });
        this.initListeners();
    }
    initListeners() {
        if (!this.socket)
            return;
        this.socket.on('connect', () => {
            var _a;
            logger_2.default.info(logger_1.CONNECT_TO_CWIRE_LOGGER_PREFIX, `Connected to cwire api as ${((_a = this.cwire.getWorker()) === null || _a === void 0 ? void 0 : _a.name) || 'unknown'} successfully`);
        });
        this.socket.on('disconnect', (error) => {
            logger_2.default.error(logger_1.DISCONNECT_TO_CWIRE_LOGGER_PREFIX, `Disconnected to cwire api with the error ${error}`);
        });
        this.socket.on('error', (error) => {
            logger_2.default.error(logger_1.CONNECTION_ERROR_LOGGER_PREFIX, `Connection error ${error.toString()}`);
        });
        this.socket.on('CALL_WORKER_FUNCTION_ACTION', this.onWorkerFunctionCalled);
        this.socket.on('GET_WORKER_FUNCTIONS_ACTION', this.getWorkerFunctions);
    }
}
exports.CWireWebSocket = CWireWebSocket;
//# sourceMappingURL=CWireWebSocket.js.map