"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueryToPrisma = void 0;
const query_1 = require("../../helper/query");
function parseWhereQueryToPrisma(model, query) {
    if (!query || typeof query !== 'object') {
        return null;
    }
    const prismaWhereQuery = {};
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
        if (typeof query[key] === 'number' ||
            typeof query[key] === 'boolean' ||
            typeof query[key] === 'string') {
            prismaWhereQuery[key] = query_1.parseFieldValue(field, query[key]);
            continue;
        }
        if (typeof query[key] === 'object') {
            let whereQuery = {};
            const operations = query[key];
            if (operations.$like && typeof operations.$like === 'string') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { search: operations.$like });
            }
            if (operations.$notLike && typeof operations.$notLike === 'string') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { search: `!${operations.$notLike}` });
            }
            if (operations.$iLike && typeof operations.$iLike === 'string') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { search: operations.$iLike, mode: 'insensitive' });
            }
            if (operations.$regex && typeof operations.$regex === 'string') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { contains: operations.$regex });
            }
            if (operations.$notRegex && typeof operations.$notRegex === 'string') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { contains: operations.$notRegex });
            }
            if ((operations.$notEqual && typeof operations.$notEqual === 'string') ||
                typeof operations.$notEqual === 'number') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { not: operations.$notEqual });
            }
            if (operations.$equal &&
                (typeof operations.$equal === 'string' ||
                    typeof operations.$equal === 'number')) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { equals: operations.$equal });
            }
            if (operations.$or && Array.isArray(operations.$or)) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { OR: operations.$or });
            }
            if (operations.$between && Array.isArray(operations.$between)) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { lte: operations.$between[0], gte: operations.$between[1] });
            }
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
            if (operations.$lower) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { lt: query_1.parseFieldValue(field, operations.$lower) });
            }
            if (operations.$lowerOrEqual) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { lte: query_1.parseFieldValue(field, operations.$lowerOrEqual) });
            }
            if (operations.$higher) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { gt: query_1.parseFieldValue(field, operations.$higher) });
            }
            if (operations.$higherOrEqual) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { gte: query_1.parseFieldValue(field, operations.$higherOrEqual) });
            }
            if (operations.$in && Array.isArray(operations.$in)) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { in: operations.$in });
            }
            if (operations.$notIn && Array.isArray(operations.$notIn)) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { notIn: operations.$notIn });
            }
            if (operations.$is &&
                (typeof operations.$is === 'string' ||
                    typeof operations.$is === 'number')) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { is: operations.$is });
            }
            prismaWhereQuery[key] = whereQuery;
        }
    }
    return prismaWhereQuery;
}
function parseQueryToPrisma(model, query) {
    const prismaQuery = {};
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
            if (typeof field !== 'string' &&
                !Array.isArray(field) &&
                field.length !== 2) {
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
exports.parseQueryToPrisma = parseQueryToPrisma;
//# sourceMappingURL=query.js.map