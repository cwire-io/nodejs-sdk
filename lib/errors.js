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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModelActionNotFoundError = exports.DataModelFieldNotFoundError = exports.DataModelNotFoundError = exports.WrongActionTypeError = exports.WrongFieldTypeError = exports.MissingRequiredPropertyError = void 0;
var MissingRequiredPropertyError = /** @class */ (function (_super) {
    __extends(MissingRequiredPropertyError, _super);
    function MissingRequiredPropertyError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MissingRequiredPropertyError;
}(Error));
exports.MissingRequiredPropertyError = MissingRequiredPropertyError;
var WrongFieldTypeError = /** @class */ (function (_super) {
    __extends(WrongFieldTypeError, _super);
    function WrongFieldTypeError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WrongFieldTypeError;
}(Error));
exports.WrongFieldTypeError = WrongFieldTypeError;
var WrongActionTypeError = /** @class */ (function (_super) {
    __extends(WrongActionTypeError, _super);
    function WrongActionTypeError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WrongActionTypeError;
}(Error));
exports.WrongActionTypeError = WrongActionTypeError;
var DataModelNotFoundError = /** @class */ (function (_super) {
    __extends(DataModelNotFoundError, _super);
    function DataModelNotFoundError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DataModelNotFoundError;
}(Error));
exports.DataModelNotFoundError = DataModelNotFoundError;
var DataModelFieldNotFoundError = /** @class */ (function (_super) {
    __extends(DataModelFieldNotFoundError, _super);
    function DataModelFieldNotFoundError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DataModelFieldNotFoundError;
}(Error));
exports.DataModelFieldNotFoundError = DataModelFieldNotFoundError;
var DataModelActionNotFoundError = /** @class */ (function (_super) {
    __extends(DataModelActionNotFoundError, _super);
    function DataModelActionNotFoundError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DataModelActionNotFoundError;
}(Error));
exports.DataModelActionNotFoundError = DataModelActionNotFoundError;
