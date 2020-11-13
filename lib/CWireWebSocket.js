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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CWireWebSocket = void 0;
var socket_io_client_1 = __importDefault(require("socket.io-client"));
var CWireWebSocket = /** @class */ (function () {
    function CWireWebSocket(cwire) {
        var _this = this;
        this.onWorkerFunctionCalled = function (functionName, params, resolve) { return __awaiter(_this, void 0, void 0, function () {
            var fn, _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        fn = this.cwire.getWorkerFunctions().getFunction(functionName);
                        if (!fn) return [3 /*break*/, 2];
                        _a = resolve;
                        return [4 /*yield*/, fn.controller.apply(fn, params)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]);
                        _b.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        resolve({ error: err_1.stack, success: false });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.getWorkerFunctions = function (resolve) {
            try {
                resolve(_this.cwire
                    .getWorkerFunctions()
                    .getFunctionList()
                    .map(function (fn) { return [fn.getName(), fn.getParameters()]; }));
            }
            catch (err) {
                console.log(err);
            }
        };
        this.cwire = cwire;
    }
    CWireWebSocket.prototype.disconnect = function () {
        if (!this.socket)
            return;
        this.socket.disconnect();
        this.socket.close();
    };
    CWireWebSocket.prototype.connect = function () {
        this.socket = socket_io_client_1.default(this.cwire.getAPIURL(), {
            path: "/workers/sync",
            transportOptions: {
                polling: {
                    extraHeaders: {
                        "x-access-token": this.cwire.getAPIKey(),
                    },
                },
            },
        });
        this.initListeners();
    };
    CWireWebSocket.prototype.initListeners = function () {
        if (!this.socket)
            return;
        this.socket.on("connect", function () {
            console.log("Connected");
        });
        this.socket.on("disconnect", function () {
            console.log("Disconnected");
        });
        this.socket.on("error", function (error) {
            console.log("error", error);
        });
        // @ts-ignore
        this.socket.on("message", function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            console.log.apply(console, data);
        });
        this.socket.on("CALL_WORKER_FUNCTION_ACTION", this.onWorkerFunctionCalled);
        this.socket.on("GET_WORKER_FUNCTIONS_ACTION", this.getWorkerFunctions);
    };
    return CWireWebSocket;
}());
exports.CWireWebSocket = CWireWebSocket;