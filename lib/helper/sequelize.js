"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEntitiesResponse = exports.parseSequelizeDataTypeToCWireDataType = void 0;
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
function buildEntitiesResponse(fields, entities) {
    var responseEntities = [];
    for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
        var entity = entities_1[_i];
        var responseEntity = {};
        for (var _a = 0, fields_1 = fields; _a < fields_1.length; _a++) {
            var field = fields_1[_a];
            responseEntity[field.getName()] = entity.get(field.getName());
        }
        responseEntities.push(responseEntity);
    }
    return responseEntities;
}
exports.buildEntitiesResponse = buildEntitiesResponse;
