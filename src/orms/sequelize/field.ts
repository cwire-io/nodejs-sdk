import { DataType, DataTypes } from 'sequelize';

import { DataModelFieldType } from '../../types/DataModelFields';

function parseSequelizeDataTypeStringToCWireDataType(
  type: string,
): DataModelFieldType {
  switch (type) {
    case DataTypes.CHAR.key:
    case DataTypes.STRING.key:
    case DataTypes.TEXT.key:
      return 'text';
    case DataTypes.BOOLEAN.key:
      return 'boolean';
    case DataTypes.INTEGER.key:
    case DataTypes.NUMBER.key:
    case DataTypes.DOUBLE.key:
    case DataTypes.FLOAT.key:
      return 'number';
    case DataTypes.DATEONLY.key:
      return 'date';
    case DataTypes.DATE.key:
      return 'dateTime';
    default:
      return 'text';
  }
}

export function parseSequelizeDataTypes(
  dataType: DataType,
): DataModelFieldType {
  if (typeof dataType === 'string') {
    return parseSequelizeDataTypeStringToCWireDataType(dataType);
  }

  return parseSequelizeDataTypeStringToCWireDataType(dataType.key);
}
