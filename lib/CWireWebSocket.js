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
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const CONNECT_TO_CWIRE = 'CONNECT_TO_CWIRE';
const CONNECTION_ERROR = 'CONNECTION_ERROR';
const DISCONNECT_TO_CWIRE = 'DISCONNECT_TO_CWIRE';
class CWireWebSocket {
    constructor(cwire) {
        this.onWorkerFunctionCalled = (functionName, params, resolve) => __awaiter(this, void 0, void 0, function* () {
            try {
                const fn = this.cwire.getWorkerFunctions().getFunction(functionName);
                if (fn) {
                    resolve(yield fn.controller(...params));
                }
            }
            catch (err) {
                resolve({ error: err.stack, success: false });
            }
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
            this.cwire
                .getLogger()
                .info(CONNECT_TO_CWIRE, `Connected to cwire api as ${((_a = this.cwire.getWorker()) === null || _a === void 0 ? void 0 : _a.name) || 'unknown'} successfully`);
        });
        this.socket.on('disconnect', (error) => {
            this.cwire
                .getLogger()
                .error(DISCONNECT_TO_CWIRE, `Disconnected to cwire api with the error ${error}`);
        });
        this.socket.on('error', (error) => {
            this.cwire
                .getLogger()
                .error(CONNECTION_ERROR, `Connection error ${error.toString()}`);
        });
        this.socket.on('CALL_WORKER_FUNCTION_ACTION', this.onWorkerFunctionCalled);
        this.socket.on('GET_WORKER_FUNCTIONS_ACTION', this.getWorkerFunctions);
    }
}
exports.CWireWebSocket = CWireWebSocket;
//# sourceMappingURL=CWireWebSocket.js.map