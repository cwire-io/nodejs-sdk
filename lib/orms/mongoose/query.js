"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWhereQuery = void 0;
function parseWhereQuery(query) {
    if (!query || typeof query !== 'object') {
        return null;
    }
    const mongooseWhereQuery = {};
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
        if (typeof query[key] === 'number' ||
            typeof query[key] === 'boolean' ||
            typeof query[key] === 'string') {
            mongooseWhereQuery[key] = query[key];
            continue;
        }
        if (typeof query[key] === 'object') {
            let whereQuery = {};
            const operations = query[key];
            if (operations.$like && typeof operations.$like === 'string') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $regex: new RegExp(operations.$like.replace(/%/g, '.*'), 'gmi') });
            }
            if (operations.$notLike && typeof operations.$notLike === 'string') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $not: new RegExp(operations.$notLike.replace(/%/g, '.*')) });
            }
            if (operations.$regex && typeof operations.$regex === 'string') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $regex: new RegExp(operations.$regex) });
            }
            if (operations.$notRegex && typeof operations.$notRegex === 'string') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $not: new RegExp(operations.$notRegex) });
            }
            if (operations.$notEqual &&
                (typeof operations.$notEqual === 'string' ||
                    typeof operations.$notEqual === 'number')) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $ne: operations.$notEqual });
            }
            if (operations.$equal &&
                (typeof operations.$equal === 'string' ||
                    typeof operations.$equal === 'number')) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $eq: operations.$equal });
            }
            if (operations.$or && Array.isArray(operations.$or)) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $or: operations.$or });
            }
            if (operations.$lower && typeof operations.$lower === 'number') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $lt: operations.$lower });
            }
            if (operations.$lowerOrEqual &&
                typeof operations.$lowerOrEqual === 'number') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $lte: operations.$lowerOrEqual });
            }
            if (operations.$higher && typeof operations.$higher === 'number') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $gt: operations.$higher });
            }
            if (operations.$higherOrEqual &&
                typeof operations.$higherOrEqual === 'number') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $gte: operations.$higherOrEqual });
            }
            if (operations.$in && Array.isArray(operations.$in)) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $in: operations.$in });
            }
            if (operations.$notIn && Array.isArray(operations.$notIn)) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $nin: operations.$notIn });
            }
            mongooseWhereQuery[key] = whereQuery;
        }
    }
    return mongooseWhereQuery;
}
exports.parseWhereQuery = parseWhereQuery;
//# sourceMappingURL=query.js.map