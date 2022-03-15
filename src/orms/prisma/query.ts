import { DataModel } from '../../DataModel';
import {
  DataModelQuery,
  DataModelQuery$Where,
  DataModelQuery$WhereOperators,
} from '../../types/DataModelQuery';
import { parseFieldValue } from '../../helper/query';

function parseWhereQueryToPrisma(
  model: DataModel,
  query?: DataModelQuery$Where,
): any {
  if (!query || typeof query !== 'object') {
    return null;
  }

  const prismaWhereQuery: any = {};
  for (const key of Object.keys(query)) {
    if (key === '$and' && Array.isArray(query[key])) {
      prismaWhereQuery.AND = [];
      for (const subQuery of query[key] || []) {
        const parsedQuery = parseWhereQueryToPrisma(model, subQuery);
        if (parsedQuery) {
          prismaWhereQuery.AND.push(parsedQuery);
        }
      }

      continue;
    }

    if (key === '$or' && Array.isArray(query[key])) {
      prismaWhereQuery.OR = [];
      for (const subQuery of query[key] || []) {
        const parsedQuery = parseWhereQueryToPrisma(model, subQuery);
        if (parsedQuery) {
          prismaWhereQuery.OR.push(parsedQuery);
        }
      }

      continue;
    }

    const field = model.getFieldByName(key);

    if (!field) {
      continue;
    }

    if (
      typeof query[key] === 'number' ||
      typeof query[key] === 'boolean' ||
      typeof query[key] === 'string'
    ) {
      prismaWhereQuery[key] = parseFieldValue(field, query[key]);
      continue;
    }

    if (typeof query[key] === 'object') {
      let whereQuery: any = {};
      const operations = query[key] as DataModelQuery$WhereOperators | any;

      // String
      if (operations.$like && typeof operations.$like === 'string') {
        whereQuery = {
          ...whereQuery,
          search: operations.$like,
        };
      }

      // String
      if (operations.$notLike && typeof operations.$notLike === 'string') {
        whereQuery = {
          ...whereQuery,
          search: `!${operations.$notLike}`,
        };
      }

      // String
      if (operations.$iLike && typeof operations.$iLike === 'string') {
        whereQuery = {
          ...whereQuery,
          search: operations.$iLike,
          mode: 'insensitive',
        };
      }

      // String
      if (operations.$regex && typeof operations.$regex === 'string') {
        whereQuery = {
          ...whereQuery,
          contains: operations.$regex,
        };
      }

      // String
      if (operations.$notRegex && typeof operations.$notRegex === 'string') {
        whereQuery = {
          ...whereQuery,
          contains: operations.$notRegex,
        };
      }

      // String | Number
      if (
        (operations.$notEqual && typeof operations.$notEqual === 'string') ||
        typeof operations.$notEqual === 'number'
      ) {
        whereQuery = {
          ...whereQuery,
          not: operations.$notEqual,
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
          equals: operations.$equal,
        };
      }

      // (String | Number)[]
      if (operations.$or && Array.isArray(operations.$or)) {
        whereQuery = {
          ...whereQuery,
          OR: operations.$or,
        };
      }

      // Number[] Sequelize only
      if (operations.$between && Array.isArray(operations.$between)) {
        whereQuery = {
          ...whereQuery,
          lte: operations.$between[0],
          gte: operations.$between[1],
        };
      }

      // Number[] Sequelize only
      if (operations.$notBetween && Array.isArray(operations.$notBetween)) {
        if (!prismaWhereQuery[key].NOT) {
          prismaWhereQuery.NOT = [];
        }
        prismaWhereQuery.NOT.push({
          [key]: {
            lte: operations.$between[0],
            gte: operations.$between[1],
          },
        });
      }

      // Number
      if (operations.$lower) {
        whereQuery = {
          ...whereQuery,
          lt: parseFieldValue(field, operations.$lower),
        };
      }

      // Number
      if (operations.$lowerOrEqual) {
        whereQuery = {
          ...whereQuery,
          lte: parseFieldValue(field, operations.$lowerOrEqual),
        };
      }

      // Number
      if (operations.$higher) {
        whereQuery = {
          ...whereQuery,
          gt: parseFieldValue(field, operations.$higher),
        };
      }

      // Number
      if (operations.$higherOrEqual) {
        whereQuery = {
          ...whereQuery,
          gte: parseFieldValue(field, operations.$higherOrEqual),
        };
      }

      // (Number | String)[]
      if (operations.$in && Array.isArray(operations.$in)) {
        whereQuery = {
          ...whereQuery,
          in: operations.$in,
        };
      }

      // (Number | String)[]
      if (operations.$notIn && Array.isArray(operations.$notIn)) {
        whereQuery = {
          ...whereQuery,
          notIn: operations.$notIn,
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
          is: operations.$is,
        };
      }

      prismaWhereQuery[key] = whereQuery;
    }
  }
  return prismaWhereQuery;
}

export function parseQueryToPrisma(
  model: DataModel,
  query: any | DataModelQuery,
) {
  const prismaQuery: any = {};

  if (!query) {
    return prismaQuery;
  }

  if (query.limit && typeof query.limit === 'number') {
    prismaQuery.take = query.limit;
  }
  if (query.offset && typeof query.offset === 'number') {
    prismaQuery.skip = query.offset;
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
      prismaQuery.orderBy = query.order;
    }
  }

  if (query.attributes && Array.isArray(query.attributes)) {
    prismaQuery.select = {};
    for (const field of query.attributes) {
      prismaQuery.select[field] = true;
    }
  }

  if (query.where && typeof query.where === 'object') {
    prismaQuery.where = parseWhereQueryToPrisma(model, query.where);
  }

  return prismaQuery;
}
