"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSequelizeDataTypes = void 0;
const sequelize_1 = require("sequelize");
function parseSequelizeDataTypeStringToCWireDataType(type) {
    switch (type) {
        case sequelize_1.DataTypes.CHAR.key:
        case sequelize_1.DataTypes.STRING.key:
        case sequelize_1.DataTypes.TEXT.key:
            return 'text';
        case sequelize_1.DataTypes.BOOLEAN.key:
            return 'boolean';
        case sequelize_1.DataTypes.INTEGER.key:
        case sequelize_1.DataTypes.NUMBER.key:
        case sequelize_1.DataTypes.DOUBLE.key:
        case sequelize_1.DataTypes.FLOAT.key:
            return 'number';
        case sequelize_1.DataTypes.DATEONLY.key:
            return 'date';
        case sequelize_1.DataTypes.DATE.key:
            return 'dateTime';
        default:
            return 'text';
    }
}
function parseSequelizeDataTypes(dataType) {
    if (typeof dataType === 'string') {
        return parseSequelizeDataTypeStringToCWireDataType(dataType);
    }
    return parseSequelizeDataTypeStringToCWireDataType(dataType.key);
}
exports.parseSequelizeDataTypes = parseSequelizeDataTypes;
//# sourceMappingURL=field.js.map