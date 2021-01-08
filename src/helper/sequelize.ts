import { DataModelField, DataModelFieldType } from '..';
import { DataModelQuery } from '../types/DataModelQuery';
import { DataTypes, DataType, Model, Op as Operators } from 'sequelize';

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
    case DataTypes.DOUBLE.key:
    case DataTypes.FLOAT.key:
      return 'number';
    default:
      return 'text';
  }
}

export function parseDataModelQueryToSequelizeQuery(
  query: any | DataModelQuery,
) {
  const sequelizeQuery: any = {};

  if (!query) {
    return sequelizeQuery;
  }

  if (query.limit && typeof query.limit === 'number') {
    sequelizeQuery.limit = query.limit;
  }
  if (query.offset && typeof query.offset === 'number') {
    sequelizeQuery.offset = query.offset;
  }

  if (query.order && Array.isArray(query.order)) {
    let isValid = true;
    for (const field of query.order) {
      if (
        typeof field !== 'string' &&
        !Array.isArray(field) &&
        field.length !== 2
      ) {
        isValid = false;
      }
    }

    if (isValid) {
      sequelizeQuery.order = query.order;
    }
  }

  if (query.attributes && Array.isArray(query.attributes)) {
    sequelizeQuery.attributes = query.attributes;
  }

  if (query.group && Array.isArray(query.group)) {
    sequelizeQuery.group = query.group;
  }

  if (query.where && typeof query.where === 'object') {
    sequelizeQuery.where = {};
    for (const key of Object.keys(query.where)) {
      if (
        typeof query.where[key] === 'number' ||
        typeof query.where[key] === 'string'
      ) {
        sequelizeQuery.where[key] = query.where[key];
        continue;
      }

      if (typeof query.where[key] === 'object') {
        sequelizeQuery.where[key] = {};

        // String
        if (
          query.where[key].$like &&
          typeof query.where[key].$like === 'string'
        ) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.like]: query.where[key].$like,
          };
        }
        // String
        if (
          query.where[key].$notLike &&
          typeof query.where[key].$notLike === 'string'
        ) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.notLike]: query.where[key].$notLike,
          };
        }
        // String
        if (
          query.where[key].$iLike &&
          typeof query.where[key].$iLike === 'string'
        ) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.iLike]: query.where[key].$iLike,
          };
        }
        // String
        if (
          query.where[key].$regex &&
          typeof query.where[key].$regex === 'string'
        ) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.regexp]: query.where[key].$regex,
          };
        }
        // String
        if (
          query.where[key].$notRegex &&
          typeof query.where[key].$notRegex === 'string'
        ) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.notLike]: query.where[key].$notLike,
          };
        }
        // String | Number
        if (
          (query.where[key].$notEqual &&
            typeof query.where[key].$notEqual === 'string') ||
          typeof query.where[key].$notEqual === 'number'
        ) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.ne]: query.where[key].$notEqual,
          };
        }
        // String | Number
        if (
          query.where[key].$equal &&
          (typeof query.where[key].$equal === 'string' ||
            typeof query.where[key].$equal === 'number')
        ) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.eq]: query.where[key].$equal,
          };
        }
        // (String | Number)[]
        if (query.where[key].$or && Array.isArray(query.where[key].$or)) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.or]: query.where[key].$or,
          };
        }
        // Number[] Sequelize only
        if (
          query.where[key].$between &&
          Array.isArray(query.where[key].$between)
        ) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.between]: query.where[key].$between,
          };
        }
        // Number[] Sequelize only
        if (
          query.where[key].$notBetween &&
          Array.isArray(query.where[key].$notBetween)
        ) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.notBetween]: query.where[key].$notBetween,
          };
        }
        if (
          query.where[key].$lower &&
          typeof query.where[key].$lower === 'number'
        ) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.lt]: query.where[key].$lower,
          };
        }
        // Number
        if (
          query.where[key].$lowerOrEqual &&
          typeof query.where[key].$lowerOrEqual === 'number'
        ) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.lte]: query.where[key].$lowerOrEqual,
          };
        }
        // Number
        if (
          query.where[key].$higher &&
          typeof query.where[key].$higher === 'number'
        ) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.gt]: query.where[key].$higher,
          };
        }
        // Number
        if (
          query.where[key].$higherOrEqual &&
          typeof query.where[key].$higherOrEqual === 'number'
        ) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.gte]: query.where[key].$higherOrEqual,
          };
        }
        // (Number | String)[]
        if (query.where[key].$in && Array.isArray(query.where[key].$in)) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.in]: query.where[key].$in,
          };
        }
        // (Number | String)[]
        if (query.where[key].$notIn && Array.isArray(query.where[key].$notIn)) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.notIn]: query.where[key].$notIn,
          };
        }
        // Number | String | Null
        if (
          query.where[key].$is &&
          (typeof query.where[key].$is === 'string' ||
            typeof query.where[key].$is === 'number')
        ) {
          sequelizeQuery.where[key] = {
            ...sequelizeQuery.where[key],
            [Operators.is]: query.where[key].$is,
          };
        }
      }
    }
  }

  return sequelizeQuery;
}

export function parseSequelizeDataTypeToCWireDataType(
  dataType: DataType,
): DataModelFieldType {
  if (typeof dataType === 'string') {
    return parseSequelizeDataTypeStringToCWireDataType(dataType);
  }

  return parseSequelizeDataTypeStringToCWireDataType(dataType.key);
}

export function buildEntitiesResponse(
  fields: DataModelField[],
  entities: Model<any, any>[],
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
