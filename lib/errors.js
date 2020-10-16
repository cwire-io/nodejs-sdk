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
exports.UnknownDataModelTypeError = exports.MissingPrimaryFieldError = exports.MultiplePrimaryFieldsAreNotAllowedError = exports.WrongModelDetectedError = exports.FeatureIsNotImplementedNowError = exports.DataModelActionNotFoundError = exports.DataModelFieldNotFoundError = exports.DataModelNotFoundError = exports.WrongActionTypeError = exports.WrongFieldTypeError = exports.MissingRequiredPropertyError = exports.WorkerNotFound = void 0;
var WorkerNotFound = /** @class */ (function (_super) {
    __extends(WorkerNotFound, _super);
    function WorkerNotFound() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WorkerNotFound;
}(Error));
exports.WorkerNotFound = WorkerNotFound;
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
var FeatureIsNotImplementedNowError = /** @class */ (function (_super) {
    __extends(FeatureIsNotImplementedNowError, _super);
    function FeatureIsNotImplementedNowError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FeatureIsNotImplementedNowError;
}(Error));
exports.FeatureIsNotImplementedNowError = FeatureIsNotImplementedNowError;
var WrongModelDetectedError = /** @class */ (function (_super) {
    __extends(WrongModelDetectedError, _super);
    function WrongModelDetectedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WrongModelDetectedError;
}(Error));
exports.WrongModelDetectedError = WrongModelDetectedError;
var MultiplePrimaryFieldsAreNotAllowedError = /** @class */ (function (_super) {
    __extends(MultiplePrimaryFieldsAreNotAllowedError, _super);
    function MultiplePrimaryFieldsAreNotAllowedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MultiplePrimaryFieldsAreNotAllowedError;
}(Error));
exports.MultiplePrimaryFieldsAreNotAllowedError = MultiplePrimaryFieldsAreNotAllowedError;
var MissingPrimaryFieldError = /** @class */ (function (_super) {
    __extends(MissingPrimaryFieldError, _super);
    function MissingPrimaryFieldError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MissingPrimaryFieldError;
}(Error));
exports.MissingPrimaryFieldError = MissingPrimaryFieldError;
var UnknownDataModelTypeError = /** @class */ (function (_super) {
    __extends(UnknownDataModelTypeError, _super);
    function UnknownDataModelTypeError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UnknownDataModelTypeError;
}(Error));
exports.UnknownDataModelTypeError = UnknownDataModelTypeError;
