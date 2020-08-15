"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CWireWebSocket = void 0;
var socket_io_client_1 = __importDefault(require("socket.io-client"));
var CWireWebSocket = /** @class */ (function () {
    function CWireWebSocket(CWire) {
        var _this = this;
        this.onWorkerFunctionCalled = function (functionName, params, resolve) {
            try {
                var fn = _this.cwire.getWorker().getFunction(functionName);
                console.log('Function', functionName, fn);
                if (fn) {
                    resolve(fn.controller.apply(fn, params));
                }
            }
            catch (err) {
            }
        };
        this.getWorkerFunctions = function (resolve) {
            try {
                resolve(_this.cwire.getWorker().getFunctionList().map(function (fn) { return [fn.getName(), fn.getParameters()]; }));
            }
            catch (err) {
            }
        };
        this.cwire = CWire;
    }
    CWireWebSocket.prototype.disconnect = function () {
        if (!this.socket)
            return;
        this.socket.disconnect();
        this.socket.close();
    };
    CWireWebSocket.prototype.connect = function () {
        this.socket = socket_io_client_1.default(this.cwire.getAPIURL(), {
            path: '/workers/sync',
            transportOptions: {
                polling: {
                    extraHeaders: {
                        'x-access-token': this.cwire.getAPIKey()
                    }
                }
            }
        });
        this.initListeners();
    };
    CWireWebSocket.prototype.initListeners = function () {
        if (!this.socket)
            return;
        this.socket.on('connect', function () {
            console.log('Connected');
        });
        this.socket.on('disconnect', function () {
            console.log('Disconnected');
        });
        this.socket.on('error', function (error) {
            console.log('error', error);
        });
        // @ts-ignore
        this.socket.on('message', function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            console.log.apply(console, data);
        });
        this.socket.on('CALL_WORKER_FUNCTION_ACTION', this.onWorkerFunctionCalled);
        this.socket.on('GET_WORKER_FUNCTIONS_ACTION', this.getWorkerFunctions);
    };
    return CWireWebSocket;
}());
exports.CWireWebSocket = CWireWebSocket;
