"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueryToSequelize = void 0;
const sequelize_1 = require("sequelize");
const query_1 = require("../../helper/query");
function parseWhereQuery(model, query) {
    if (!query || typeof query !== 'object') {
        return null;
    }
    const sequelizeWhereQuery = {};
    for (const key of Object.keys(query)) {
        if (key === '$and' && Array.isArray(query[key])) {
            sequelizeWhereQuery[sequelize_1.Op.and] = [];
            for (const subQuery of query[key] || []) {
                const parsedQuery = parseWhereQuery(model, subQuery);
                if (parsedQuery) {
                    sequelizeWhereQuery[sequelize_1.Op.and].push(parsedQuery);
                }
            }
            continue;
        }
        if (key === '$or' && Array.isArray(query[key])) {
            sequelizeWhereQuery[sequelize_1.Op.or] = [];
            for (const subQuery of query[key] || []) {
                const parsedQuery = parseWhereQuery(model, subQuery);
                if (parsedQuery) {
                    sequelizeWhereQuery[sequelize_1.Op.or].push(parsedQuery);
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
            sequelizeWhereQuery[key] = query_1.parseFieldValue(field, query[key]);
            continue;
        }
        if (typeof query[key] === 'object') {
            let whereQuery = {};
            const operations = query[key];
            if (operations.$like && typeof operations.$like === 'string') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.like]: operations.$like });
            }
            if (operations.$notLike && typeof operations.$notLike === 'string') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.notLike]: operations.$notLike });
            }
            if (operations.$iLike && typeof operations.$iLike === 'string') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.iLike]: operations.$iLike });
            }
            if (operations.$regex && typeof operations.$regex === 'string') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.regexp]: operations.$regex });
            }
            if (operations.$notRegex && typeof operations.$notRegex === 'string') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.notLike]: operations.$notLike });
            }
            if ((operations.$notEqual && typeof operations.$notEqual === 'string') ||
                typeof operations.$notEqual === 'number') {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.ne]: operations.$notEqual });
            }
            if (operations.$equal &&
                (typeof operations.$equal === 'string' ||
                    typeof operations.$equal === 'number')) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.eq]: operations.$equal });
            }
            if (operations.$or && Array.isArray(operations.$or)) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.or]: operations.$or });
            }
            if (operations.$between && Array.isArray(operations.$between)) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.between]: operations.$between });
            }
            if (operations.$notBetween && Array.isArray(operations.$notBetween)) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.notBetween]: operations.$notBetween });
            }
            if (operations.$lower) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.lt]: query_1.parseFieldValue(field, operations.$lower) });
            }
            if (operations.$lowerOrEqual) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.lte]: query_1.parseFieldValue(field, operations.$lowerOrEqual) });
            }
            if (operations.$higher) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.gt]: query_1.parseFieldValue(field, operations.$higher) });
            }
            if (operations.$higherOrEqual) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.gte]: query_1.parseFieldValue(field, operations.$higherOrEqual) });
            }
            if (operations.$in && Array.isArray(operations.$in)) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.in]: operations.$in });
            }
            if (operations.$notIn && Array.isArray(operations.$notIn)) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.notIn]: operations.$notIn });
            }
            if (operations.$is &&
                (typeof operations.$is === 'string' ||
                    typeof operations.$is === 'number')) {
                whereQuery = Object.assign(Object.assign({}, whereQuery), { [sequelize_1.Op.is]: operations.$is });
            }
            sequelizeWhereQuery[key] = whereQuery;
        }
    }
    return sequelizeWhereQuery;
}
function parseQueryToSequelize(model, query) {
    const sequelizeQuery = {};
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
            if (typeof field !== 'string' &&
                !Array.isArray(field) &&
                field.length !== 2) {
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
        sequelizeQuery.where = parseWhereQuery(model, query.where);
    }
    return sequelizeQuery;
}
exports.parseQueryToSequelize = parseQueryToSequelize;
//# sourceMappingURL=query.js.map