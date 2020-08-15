"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CWireSocket = void 0;
var socket_io_client_1 = __importDefault(require("socket.io-client"));
var CWireSocket = /** @class */ (function () {
    function CWireSocket(CWire) {
        var _this = this;
        this.getDataModelEntities = function (modelName) {
            if (!_this.socket)
                return;
            _this.socket.emit('GET_DATA_MODEL_ENTITIES_SUCCESS_ACTION', _this.cwire.getDataModelByName(modelName).getOptions().get());
        };
        this.cwire = CWire;
    }
    CWireSocket.prototype.disconnect = function () {
        if (!this.socket)
            return;
        this.socket.disconnect();
        this.socket.close();
    };
    CWireSocket.prototype.connect = function () {
        this.socket = socket_io_client_1.default(this.cwire.getAPIURL(), {
            path: '/models/sync',
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
    CWireSocket.prototype.initListeners = function () {
        if (!this.socket)
            return;
        this.socket.on('connect_failed', function () {
            console.log('Connection Failed');
        });
        this.socket.on('connect', function () {
            console.log('Connected');
        });
        this.socket.on('disconnect', function () {
            console.log('Disconnected');
        });
        this.socket.on('error', function (error) {
            console.log('error', error);
        });
        this.socket.on('GET_DATA_MODEL_ENTITIES_ACTION', this.getDataModelEntities);
    };
    return CWireSocket;
}());
exports.CWireSocket = CWireSocket;
