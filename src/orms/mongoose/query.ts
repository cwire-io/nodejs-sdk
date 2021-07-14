// Build Query
import { DataModelQuery } from '../../types/DataModelQuery';

export function parseDataModelQueryToMongooseQuery(query: DataModelQuery) {
  const mongooseQuery: any = {};

  if (!query) {
    return mongooseQuery;
  }

  if (query.where && typeof query.where === 'object') {
    for (const key of Object.keys(query.where)) {
      if (
        typeof query.where[key] === 'number' ||
        typeof query.where[key] === 'string'
      ) {
        mongooseQuery[key] = query.where[key];
        continue;
      }

      const whereQuery = query.where[key];
      if (typeof whereQuery === 'object') {
        // String
        if (whereQuery.$like && typeof whereQuery.$like === 'string') {
          mongooseQuery[key] = {
            $regex: new RegExp(whereQuery.$like.replace('%', '.*')),
          };
        }
        // String
        if (whereQuery.$notLike && typeof whereQuery.$notLike === 'string') {
          mongooseQuery[key] = {
            $not: new RegExp(whereQuery.$notLike.replace('%', '.*')),
          };
        }

        // String
        if (whereQuery.$regex && typeof whereQuery.$regex === 'string') {
          mongooseQuery[key] = {
            $regex: new RegExp(whereQuery.$regex.replace('%', '.*')),
          };
        }

        // String
        if (whereQuery.$notRegex && typeof whereQuery.$notRegex === 'string') {
          mongooseQuery[key] = {
            $not: new RegExp(whereQuery.$notRegex.replace('%', '.*')),
          };
        }

        // String | Number
        if (
          whereQuery.$notEqual &&
          (typeof whereQuery.$notEqual === 'string' ||
            typeof whereQuery.$notEqual === 'number')
        ) {
          mongooseQuery[key].$ne = whereQuery.$notEqual;
        }

        // String | Number
        if (
          whereQuery.$equal &&
          (typeof whereQuery.$equal === 'string' ||
            typeof whereQuery.$equal === 'number')
        ) {
          mongooseQuery[key].$eq = whereQuery.$equal;
        }

        // (String | Number)[]
        if (whereQuery.$or && Array.isArray(whereQuery.$or)) {
          mongooseQuery[key] = {
            $or: whereQuery.$or,
          };
        }

        // Number
        if (whereQuery.$lower && typeof whereQuery.$lower === 'number') {
          mongooseQuery[key] = {
            $lt: whereQuery.$lower,
          };
        }
        // Number
        if (
          whereQuery.$lowerOrEqual &&
          typeof whereQuery.$lowerOrEqual === 'number'
        ) {
          mongooseQuery[key] = {
            $lte: whereQuery.$lowerOrEqual,
          };
        }
        // Number
        if (whereQuery.$higher && typeof whereQuery.$higher === 'number') {
          mongooseQuery[key] = {
            $gt: whereQuery.$higher,
          };
        }
        // Number
        if (
          whereQuery.$higherOrEqual &&
          typeof whereQuery.$higherOrEqual === 'number'
        ) {
          mongooseQuery[key] = {
            $gte: whereQuery.$higherOrEqual,
          };
        }

        // (Number | String)[]
        if (whereQuery.$in && Array.isArray(whereQuery.$in)) {
          mongooseQuery[key] = {
            $in: whereQuery.$in,
          };
        }
        // (Number | String)[]
        if (whereQuery.$notIn && Array.isArray(whereQuery.$notIn)) {
          mongooseQuery[key] = {
            $nin: whereQuery.$notIn,
          };
        }
      }
    }
  }
  return mongooseQuery;
}
