import { Op as Operators } from 'sequelize';
import {
  DataModelQuery,
  DataModelQuery$Where,
  DataModelQuery$WhereOperators,
} from '../../types/DataModelQuery';

function parseWhereQuery(query?: DataModelQuery$Where): any {
  if (!query || typeof query !== 'object') {
    return null;
  }

  const sequelizeWhereQuery: any = {};
  for (const key of Object.keys(query)) {
    if (key === '$and' && Array.isArray(query[key])) {
      sequelizeWhereQuery[Operators.and] = [];
      for (const subQuery of query[key] || []) {
        const parsedQuery = parseWhereQuery(subQuery);
        if (parsedQuery) {
          sequelizeWhereQuery[Operators.and].push(parsedQuery);
        }
      }

      continue;
    }

    if (key === '$or' && Array.isArray(query[key])) {
      sequelizeWhereQuery[Operators.or] = [];
      for (const subQuery of query[key] || []) {
        const parsedQuery = parseWhereQuery(subQuery);
        if (parsedQuery) {
          sequelizeWhereQuery[Operators.or].push(parsedQuery);
        }
      }

      continue;
    }

    if (
      typeof query[key] === 'number' ||
      typeof query[key] === 'boolean' ||
      typeof query[key] === 'string'
    ) {
      sequelizeWhereQuery[key] = query[key];
      continue;
    }

    if (typeof query[key] === 'object') {
      let whereQuery: any = {};
      const operations = query[key] as DataModelQuery$WhereOperators | any;

      // String
      if (operations.$like && typeof operations.$like === 'string') {
        whereQuery = {
          ...whereQuery,
          [Operators.like]: operations.$like,
        };
      }

      // String
      if (operations.$notLike && typeof operations.$notLike === 'string') {
        whereQuery = {
          ...whereQuery,
          [Operators.notLike]: operations.$notLike,
        };
      }

      // String
      if (operations.$iLike && typeof operations.$iLike === 'string') {
        whereQuery = {
          ...whereQuery,
          [Operators.iLike]: operations.$iLike,
        };
      }

      // String
      if (operations.$regex && typeof operations.$regex === 'string') {
        whereQuery = {
          ...whereQuery,
          [Operators.regexp]: operations.$regex,
        };
      }

      // String
      if (operations.$notRegex && typeof operations.$notRegex === 'string') {
        whereQuery = {
          ...whereQuery,
          [Operators.notLike]: operations.$notLike,
        };
      }

      // String | Number
      if (
        (operations.$notEqual && typeof operations.$notEqual === 'string') ||
        typeof operations.$notEqual === 'number'
      ) {
        whereQuery = {
          ...whereQuery,
          [Operators.ne]: operations.$notEqual,
        };
      }

      // String | Number
      if (
        operations.$equal &&
        (typeof operations.$equal === 'string' ||
          typeof operations.$equal === 'number')
      ) {
        whereQuery = {
          ...whereQuery,
          [Operators.eq]: operations.$equal,
        };
      }

      // (String | Number)[]
      if (operations.$or && Array.isArray(operations.$or)) {
        whereQuery = {
          ...whereQuery,
          [Operators.or]: operations.$or,
        };
      }

      // Number[] Sequelize only
      if (operations.$between && Array.isArray(operations.$between)) {
        whereQuery = {
          ...whereQuery,
          [Operators.between]: operations.$between,
        };
      }

      // Number[] Sequelize only
      if (operations.$notBetween && Array.isArray(operations.$notBetween)) {
        whereQuery = {
          ...whereQuery,
          [Operators.notBetween]: operations.$notBetween,
        };
      }

      // Number
      if (operations.$lower && typeof operations.$lower === 'number') {
        whereQuery = {
          ...whereQuery,
          [Operators.lt]: operations.$lower,
        };
      }

      // Number
      if (
        operations.$lowerOrEqual &&
        typeof operations.$lowerOrEqual === 'number'
      ) {
        whereQuery = {
          ...whereQuery,
          [Operators.lte]: operations.$lowerOrEqual,
        };
      }

      // Number
      if (operations.$higher && typeof operations.$higher === 'number') {
        whereQuery = {
          ...whereQuery,
          [Operators.gt]: operations.$higher,
        };
      }

      // Number
      if (
        operations.$higherOrEqual &&
        typeof operations.$higherOrEqual === 'number'
      ) {
        whereQuery = {
          ...whereQuery,
          [Operators.gte]: operations.$higherOrEqual,
        };
      }

      // (Number | String)[]
      if (operations.$in && Array.isArray(operations.$in)) {
        whereQuery = {
          ...whereQuery,
          [Operators.in]: operations.$in,
        };
      }

      // (Number | String)[]
      if (operations.$notIn && Array.isArray(operations.$notIn)) {
        whereQuery = {
          ...whereQuery,
          [Operators.notIn]: operations.$notIn,
        };
      }
      // Number | String | Null
      if (
        operations.$is &&
        (typeof operations.$is === 'string' ||
          typeof operations.$is === 'number')
      ) {
        whereQuery = {
          ...whereQuery,
          [Operators.is]: operations.$is,
        };
      }

      sequelizeWhereQuery[key] = whereQuery;
    }
  }

  return sequelizeWhereQuery;
}

export function parseQueryToSequelize(query: any | DataModelQuery) {
  const sequelizeQuery: any = {};
  sequelizeQuery.include = [];

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
    sequelizeQuery.where = parseWhereQuery(query.where);
  }

  return sequelizeQuery;
}
