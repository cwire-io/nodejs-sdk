"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEntitiesResponse = exports.parseSequelizeDataTypeToCWireDataType = exports.parseDataModelQueryToSequelizeQuery = void 0;
var sequelize_1 = require("sequelize");
function parseSequelizeDataTypeStringToCWireDataType(type) {
    switch (type) {
        case sequelize_1.DataTypes.CHAR.key:
        case sequelize_1.DataTypes.STRING.key:
        case sequelize_1.DataTypes.TEXT.key:
            return "text";
        case sequelize_1.DataTypes.BOOLEAN.key:
            return "boolean";
        case sequelize_1.DataTypes.INTEGER.key:
        case sequelize_1.DataTypes.DOUBLE.key:
        case sequelize_1.DataTypes.FLOAT.key:
            return "number";
        default:
            return "text";
    }
}
function parseDataModelQueryToSequelizeQuery(query) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    var sequelizeQuery = {};
    if (query.limit && typeof query.limit === "number") {
        sequelizeQuery.limit = query.limit;
    }
    if (query.offset && typeof query.offset === "number") {
        sequelizeQuery.offset = query.offset;
    }
    if (query.order && Array.isArray(query.order)) {
        var isValid = true;
        for (var _i = 0, _t = query.order; _i < _t.length; _i++) {
            var field = _t[_i];
            if (typeof field !== "string" &&
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
    if (query.where && typeof query.where === "object") {
        sequelizeQuery.where = {};
        for (var _u = 0, _v = Object.keys(query.where); _u < _v.length; _u++) {
            var key = _v[_u];
            if (typeof query.where[key] === "number" ||
                typeof query.where[key] === "string") {
                sequelizeQuery.where[key] = query.where[key];
                continue;
            }
            if (typeof query.where[key] === "object") {
                // String
                if (query.where[key].$like &&
                    typeof query.where[key].$like === "string") {
                    sequelizeQuery.where[key] = (_a = {},
                        _a[sequelize_1.Op.like] = query.where[key].$like,
                        _a);
                }
                // String
                if (query.where[key].$notLike &&
                    typeof query.where[key].$notLike === "string") {
                    sequelizeQuery.where[key] = (_b = {},
                        _b[sequelize_1.Op.notLike] = query.where[key].$notLike,
                        _b);
                }
                // String
                if (query.where[key].$iLike &&
                    typeof query.where[key].$iLike === "string") {
                    sequelizeQuery.where[key] = (_c = {},
                        _c[sequelize_1.Op.iLike] = query.where[key].$iLike,
                        _c);
                }
                // String
                if (query.where[key].$regex &&
                    typeof query.where[key].$regex === "string") {
                    sequelizeQuery.where[key] = (_d = {},
                        _d[sequelize_1.Op.regexp] = query.where[key].$regex,
                        _d);
                }
                // String
                if (query.where[key].$notRegex &&
                    typeof query.where[key].$notRegex === "string") {
                    sequelizeQuery.where[key] = (_e = {},
                        _e[sequelize_1.Op.notLike] = query.where[key].$notLike,
                        _e);
                }
                // String | Number
                if ((query.where[key].$notEqual &&
                    typeof query.where[key].$notEqual === "string") ||
                    typeof query.where[key].$notEqual === "number") {
                    sequelizeQuery.where[key] = (_f = {},
                        _f[sequelize_1.Op.ne] = query.where[key].$notEqual,
                        _f);
                }
                // String | Number
                if (query.where[key].$equal &&
                    (typeof query.where[key].$equal === "string" ||
                        typeof query.where[key].$equal === "number")) {
                    sequelizeQuery.where[key] = (_g = {},
                        _g[sequelize_1.Op.eq] = query.where[key].$equal,
                        _g);
                }
                // (String | Number)[]
                if (query.where[key].$or && Array.isArray(query.where[key].$or)) {
                    sequelizeQuery.where[key] = (_h = {},
                        _h[sequelize_1.Op.or] = query.where[key].$or,
                        _h);
                }
                // Number[] Sequelize only
                if (query.where[key].$between &&
                    Array.isArray(query.where[key].$between)) {
                    sequelizeQuery.where[key] = (_j = {},
                        _j[sequelize_1.Op.between] = query.where[key].$between,
                        _j);
                }
                // Number[] Sequelize only
                if (query.where[key].$notBetween &&
                    Array.isArray(query.where[key].$notBetween)) {
                    sequelizeQuery.where[key] = (_k = {},
                        _k[sequelize_1.Op.notBetween] = query.where[key].$notBetween,
                        _k);
                }
                // Number
                if (query.where[key].$lower &&
                    typeof query.where[key].$lower === "number") {
                    sequelizeQuery.where[key] = (_l = {},
                        _l[sequelize_1.Op.lt] = query.where[key].$lower,
                        _l);
                }
                // Number
                if (query.where[key].$lowerOrEqual &&
                    typeof query.where[key].$lowerOrEqual === "number") {
                    sequelizeQuery.where[key] = (_m = {},
                        _m[sequelize_1.Op.lte] = query.where[key].$lowerOrEqual,
                        _m);
                }
                // Number
                if (query.where[key].$higher &&
                    typeof query.where[key].$higher === "number") {
                    sequelizeQuery.where[key] = (_o = {},
                        _o[sequelize_1.Op.gt] = query.where[key].$higher,
                        _o);
                }
                // Number
                if (query.where[key].$higherOrEqual &&
                    typeof query.where[key].$higherOrEqual === "number") {
                    sequelizeQuery.where[key] = (_p = {},
                        _p[sequelize_1.Op.gte] = query.where[key].$higherOrEqual,
                        _p);
                }
                // (Number | String)[]
                if (query.where[key].$in && Array.isArray(query.where[key].$in)) {
                    sequelizeQuery.where[key] = (_q = {},
                        _q[sequelize_1.Op.in] = query.where[key].$in,
                        _q);
                }
                // (Number | String)[]
                if (query.where[key].$notIn && Array.isArray(query.where[key].$notIn)) {
                    sequelizeQuery.where[key] = (_r = {},
                        _r[sequelize_1.Op.notIn] = query.where[key].$notIn,
                        _r);
                }
                // Number | String | Null
                if (query.where[key].$is &&
                    (typeof query.where[key].$is === "string" ||
                        typeof query.where[key].$is === "number")) {
                    sequelizeQuery.where[key] = (_s = {},
                        _s[sequelize_1.Op.is] = query.where[key].$is,
                        _s);
                }
            }
        }
    }
    return sequelizeQuery;
}
exports.parseDataModelQueryToSequelizeQuery = parseDataModelQueryToSequelizeQuery;
function parseSequelizeDataTypeToCWireDataType(dataType) {
    if (typeof dataType === "string") {
        return parseSequelizeDataTypeStringToCWireDataType(dataType);
    }
    return parseSequelizeDataTypeStringToCWireDataType(dataType.key);
}
exports.parseSequelizeDataTypeToCWireDataType = parseSequelizeDataTypeToCWireDataType;
function buildEntitiesResponse(fields, entities) {
    var responseEntities = [];
    for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
        var entity = entities_1[_i];
        var responseEntity = {};
        for (var _a = 0, fields_1 = fields; _a < fields_1.length; _a++) {
            var field = fields_1[_a];
            responseEntity[field.getName()] = entity.get(field.getName());
        }
        responseEntities.push(responseEntity);
    }
    return responseEntities;
}
exports.buildEntitiesResponse = buildEntitiesResponse;
