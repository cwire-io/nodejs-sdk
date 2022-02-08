"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWhereQuery = void 0;
const query_1 = require("../../helper/query");
function parseWhereQuery(model, query) {
    if (!query || typeof query !== 'object') {
        return {};
    }
    const mongooseWhereQuery = {};
    for (const key of Object.keys(query)) {
        if (key === '$and' && Array.isArray(query[key])) {
            mongooseWhereQuery.$and = [];
            for (const subQuery of query[key] || []) {
                const parsedQuery = parseWhereQuery(model, subQuery);
                if (parsedQuery) {
                    mongooseWhereQuery.$and.push(parsedQuery);
                }
            }
            continue;
        }
        if (key === '$or' && Array.isArray(query[key])) {
            mongooseWhereQuery.$or = [];
            for (const subQuery of query[key] || []) {
                const parsedQuery = parseWhereQuery(model, subQuery);
                if (parsedQuery) {
                    mongooseWhereQuery.$or.push(parsedQuery);
                }
            }
            continue;
        }
        const field = model.getFieldByName(key);
        if (!field) {
            continue;
        }
        if (typeof query[key] === 'number' ||
            typeof query[key] === 'boolean' ||
            typeof query[key] === 'string') {
            mongooseWhereQuery[key] = query_1.parseFieldValue(field, query[key]);
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
            if (operations.$notEqual) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $ne: query_1.parseFieldValue(field, operations.$notEqual) });
            }
            if (operations.$equal) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $eq: query_1.parseFieldValue(field, operations.$equal) });
            }
            if (operations.$between && Array.isArray(operations.$between)) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $gte: query_1.parseFieldValue(field, operations.$between[0]), $lte: query_1.parseFieldValue(field, operations.$between[1]) });
            }
            if (operations.$or && Array.isArray(operations.$or)) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $or: operations.$or });
            }
            if (operations.$lower) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $lt: query_1.parseFieldValue(field, operations.$lower) });
            }
            if (operations.$lowerOrEqual) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $lte: query_1.parseFieldValue(field, operations.$lowerOrEqual) });
            }
            if (operations.$higher) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $gt: query_1.parseFieldValue(field, operations.$higher) });
            }
            if (operations.$higherOrEqual) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { $gte: query_1.parseFieldValue(field, operations.$higherOrEqual) });
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