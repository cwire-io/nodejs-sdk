"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSequelizeDataTypeToCWireDataType = void 0;
var sequelize_1 = require("sequelize");
function parseSequelizeDataTypeStringToCWireDataType(type) {
    switch (type) {
        case sequelize_1.DataTypes.CHAR.key:
        case sequelize_1.DataTypes.STRING.key:
        case sequelize_1.DataTypes.TEXT.key:
            return "text";
        case sequelize_1.DataTypes.BOOLEAN.key:
            return "boolean";
        case sequelize_1.DataTypes.INTEGER.key:
        case sequelize_1.DataTypes.DOUBLE.key:
        case sequelize_1.DataTypes.FLOAT.key:
            return "number";
        default:
            return "text";
    }
}
function parseSequelizeDataTypeToCWireDataType(dataType) {
    if (typeof dataType === "string") {
        return parseSequelizeDataTypeStringToCWireDataType(dataType);
    }
    return parseSequelizeDataTypeStringToCWireDataType(dataType.key);
}
exports.parseSequelizeDataTypeToCWireDataType = parseSequelizeDataTypeToCWireDataType;
