"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Create = void 0;
var WorkerFunction_1 = require("../WorkerFunction");
var sequelize_1 = require("../../helper/sequelize");
var mongoose_1 = require("../../helper/mongoose");
var Create = /** @class */ (function (_super) {
    __extends(Create, _super);
    function Create() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Create.prototype.controller = function (modelName, values) {
        return __awaiter(this, void 0, void 0, function () {
            var dataModel, _a, entity, err_1, entity, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        dataModel = this.cwire.getDataModelByName(modelName);
                        _a = dataModel.getType();
                        switch (_a) {
                            case "Sequelize": return [3 /*break*/, 1];
                            case "Mongoose": return [3 /*break*/, 4];
                            case "Custom": return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 8];
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dataModel.getSequelizeModel().create(values)];
                    case 2:
                        entity = _b.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: sequelize_1.buildEntitiesResponse(dataModel.getFieldsList(), [entity]),
                            }];
                    case 3:
                        err_1 = _b.sent();
                        return [2 /*return*/, { success: false, error: err_1 }];
                    case 4:
                        _b.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, dataModel.getMongooseModel().create(values)];
                    case 5:
                        entity = _b.sent();
                        return [2 /*return*/, {
                                success: true,
                                data: mongoose_1.buildMongooseEntitiesResponse(dataModel.getFieldsList(), [
                                    entity,
                                ]),
                            }];
                    case 6:
                        err_2 = _b.sent();
                        return [2 /*return*/, { success: false, error: err_2 }];
                    case 7: return [2 /*return*/, { success: true, data: null }];
                    case 8: return [2 /*return*/, { success: true, data: null }];
                }
            });
        });
    };
    Create.prototype.getName = function () {
        return "DATA_MODEL::CREATE";
    };
    Create.prototype.getParameters = function () {
        return [
            {
                type: "option",
                options: this.cwire.getDataModelsList().map(function (model) { return model.getName(); }),
                name: "modelName",
                isRequired: true,
            },
            {
                name: "values",
                type: "values",
                isRequired: true,
            },
        ];
    };
    return Create;
}(WorkerFunction_1.WorkerFunction));
exports.Create = Create;