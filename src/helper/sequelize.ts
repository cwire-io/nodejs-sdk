import { DataType, DataTypes } from "sequelize";
import { DataModelFieldType } from "..";

function parseSequelizeDataTypeStringToCWireDataType(
  type: string
): DataModelFieldType {
  switch (type) {
    case DataTypes.CHAR.key:
    case DataTypes.STRING.key:
    case DataTypes.TEXT.key:
      return "text";
    case DataTypes.BOOLEAN.key:
      return "boolean";
    case DataTypes.INTEGER.key:
    case DataTypes.DOUBLE.key:
    case DataTypes.FLOAT.key:
      return "number";
    default:
      return "text";
  }
}

export function parseSequelizeDataTypeToCWireDataType(
  dataType: DataType
): DataModelFieldType {
  if (typeof dataType === "string") {
    return parseSequelizeDataTypeStringToCWireDataType(dataType);
  }

  return parseSequelizeDataTypeStringToCWireDataType(dataType.key);
}
