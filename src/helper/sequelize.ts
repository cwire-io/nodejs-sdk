import { DataType, DataTypes, Model } from "sequelize";
import { DataModelField, DataModelFieldType } from "..";

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

export function buildEntitiesResponse(
  fields: DataModelField[],
  entities: Model<any, any>[]
) {
  const responseEntities: any[string] = [];
  for (const entity of entities) {
    const responseEntity: any = {};
    for (const field of fields) {
      responseEntity[field.getName()] = entity.get(field.getName());
    }
    responseEntities.push(responseEntity);
  }

  return responseEntities;
}
