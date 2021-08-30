import {
  DataModelQuery$Where,
  DataModelQuery$WhereOperators,
} from '../../types/DataModelQuery';

export function parseWhereQuery(query?: DataModelQuery$Where): any {
  if (!query || typeof query !== 'object') {
    return null;
  }

  const mongooseWhereQuery: any = {};
  for (const key of Object.keys(query)) {
    if (key === '$and' && Array.isArray(query[key])) {
      mongooseWhereQuery.$and = [];
      for (const subQuery of query[key] || []) {
        const parsedQuery = parseWhereQuery(subQuery);
        if (parsedQuery) {
          mongooseWhereQuery.$and.push(parsedQuery);
        }
      }

      continue;
    }

    if (key === '$or' && Array.isArray(query[key])) {
      mongooseWhereQuery.$or = [];
      for (const subQuery of query[key] || []) {
        const parsedQuery = parseWhereQuery(subQuery);
        if (parsedQuery) {
          mongooseWhereQuery.$or.push(parsedQuery);
        }
      }

      continue;
    }

    if (
      typeof query[key] === 'number' ||
      typeof query[key] === 'boolean' ||
      typeof query[key] === 'string'
    ) {
      mongooseWhereQuery[key] = query[key];
      continue;
    }

    if (typeof query[key] === 'object') {
      let whereQuery: any = {};
      const operations = query[key] as DataModelQuery$WhereOperators | any;

      // String
      if (operations.$like && typeof operations.$like === 'string') {
        whereQuery = {
          ...whereQuery,
          $regex: new RegExp(operations.$like.replace(/%/g, '.*'), 'gmi'),
        };
      }
      // String
      if (operations.$notLike && typeof operations.$notLike === 'string') {
        whereQuery = {
          ...whereQuery,
          $not: new RegExp(operations.$notLike.replace(/%/g, '.*')),
        };
      }

      // String
      if (operations.$regex && typeof operations.$regex === 'string') {
        whereQuery = {
          ...whereQuery,
          $regex: new RegExp(operations.$regex),
        };
      }

      // String
      if (operations.$notRegex && typeof operations.$notRegex === 'string') {
        whereQuery = {
          ...whereQuery,
          $not: new RegExp(operations.$notRegex),
        };
      }

      // String | Number
      if (
        operations.$notEqual &&
        (typeof operations.$notEqual === 'string' ||
          typeof operations.$notEqual === 'number')
      ) {
        whereQuery = {
          ...whereQuery,
          $ne: operations.$notEqual,
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
          $eq: operations.$equal,
        };
      }

      // (String | Number)[]
      if (operations.$or && Array.isArray(operations.$or)) {
        whereQuery = {
          ...whereQuery,
          $or: operations.$or,
        };
      }

      // Number
      if (operations.$lower && typeof operations.$lower === 'number') {
        whereQuery = {
          ...whereQuery,
          $lt: operations.$lower,
        };
      }

      // Number
      if (
        operations.$lowerOrEqual &&
        typeof operations.$lowerOrEqual === 'number'
      ) {
        whereQuery = {
          ...whereQuery,
          $lte: operations.$lowerOrEqual,
        };
      }
      // Number
      if (operations.$higher && typeof operations.$higher === 'number') {
        whereQuery = {
          ...whereQuery,
          $gt: operations.$higher,
        };
      }
      // Number
      if (
        operations.$higherOrEqual &&
        typeof operations.$higherOrEqual === 'number'
      ) {
        whereQuery = {
          ...whereQuery,
          $gte: operations.$higherOrEqual,
        };
      }

      // (Number | String)[]
      if (operations.$in && Array.isArray(operations.$in)) {
        whereQuery = {
          ...whereQuery,
          $in: operations.$in,
        };
      }
      // (Number | String)[]
      if (operations.$notIn && Array.isArray(operations.$notIn)) {
        whereQuery = {
          ...whereQuery,
          $nin: operations.$notIn,
        };
      }

      mongooseWhereQuery[key] = whereQuery;
    }
  }

  return mongooseWhereQuery;
}
