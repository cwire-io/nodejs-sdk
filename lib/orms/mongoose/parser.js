"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMongooseEntitiesResponse = exports.parseDataModelQueryToMongooseQuery = exports.parseMongooseSchemaToCWireDataType = void 0;
function parseMongooseSchemaToCWireDataType(obj) {
    if (obj.instance === 'String') {
        return 'text';
    }
    if (obj.instance === 'Number') {
        return 'number';
    }
    if (obj.instance === 'Boolean') {
        return 'boolean';
    }
    if (obj.instance === 'Date') {
        return 'text';
    }
    if (obj.instance === 'ObjectID') {
        return 'text';
    }
    return null;
}
exports.parseMongooseSchemaToCWireDataType = parseMongooseSchemaToCWireDataType;
function parseDataModelQueryToMongooseQuery(query) {
    const mongooseQuery = {};
    if (!query) {
        return mongooseQuery;
    }
    if (query.where && typeof query.where === 'object') {
        for (const key of Object.keys(query.where)) {
            if (typeof query.where[key] === 'number' ||
                typeof query.where[key] === 'string') {
                mongooseQuery[key] = query.where[key];
                continue;
            }
            const whereQuery = query.where[key];
            if (typeof whereQuery === 'object') {
                if (whereQuery.$like && typeof whereQuery.$like === 'string') {
                    mongooseQuery[key] = {
                        $regex: new RegExp(whereQuery.$like.replace('%', '.*')),
                    };
                }
                if (whereQuery.$notLike && typeof whereQuery.$notLike === 'string') {
                    mongooseQuery[key] = {
                        $not: new RegExp(whereQuery.$notLike.replace('%', '.*')),
                    };
                }
                if (whereQuery.$regex && typeof whereQuery.$regex === 'string') {
                    mongooseQuery[key] = {
                        $regex: new RegExp(whereQuery.$regex.replace('%', '.*')),
                    };
                }
                if (whereQuery.$notRegex && typeof whereQuery.$notRegex === 'string') {
                    mongooseQuery[key] = {
                        $not: new RegExp(whereQuery.$notRegex.replace('%', '.*')),
                    };
                }
                if (whereQuery.$notEqual &&
                    (typeof whereQuery.$notEqual === 'string' ||
                        typeof whereQuery.$notEqual === 'number')) {
                    mongooseQuery[key].$ne = whereQuery.$notEqual;
                }
                if (whereQuery.$equal &&
                    (typeof whereQuery.$equal === 'string' ||
                        typeof whereQuery.$equal === 'number')) {
                    mongooseQuery[key].$eq = whereQuery.$equal;
                }
                if (whereQuery.$or && Array.isArray(whereQuery.$or)) {
                    mongooseQuery[key] = {
                        $or: whereQuery.$or,
                    };
                }
                if (whereQuery.$lower && typeof whereQuery.$lower === 'number') {
                    mongooseQuery[key] = {
                        $lt: whereQuery.$lower,
                    };
                }
                if (whereQuery.$lowerOrEqual &&
                    typeof whereQuery.$lowerOrEqual === 'number') {
                    mongooseQuery[key] = {
                        $lte: whereQuery.$lowerOrEqual,
                    };
                }
                if (whereQuery.$higher && typeof whereQuery.$higher === 'number') {
                    mongooseQuery[key] = {
                        $gt: whereQuery.$higher,
                    };
                }
                if (whereQuery.$higherOrEqual &&
                    typeof whereQuery.$higherOrEqual === 'number') {
                    mongooseQuery[key] = {
                        $gte: whereQuery.$higherOrEqual,
                    };
                }
                if (whereQuery.$in && Array.isArray(whereQuery.$in)) {
                    mongooseQuery[key] = {
                        $in: whereQuery.$in,
                    };
                }
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
exports.parseDataModelQueryToMongooseQuery = parseDataModelQueryToMongooseQuery;
function buildMongooseEntitiesResponse(fields, entities) {
    const responseEntities = [];
    for (const entity of entities) {
        const responseEntity = {};
        for (const field of fields) {
            responseEntity[field.getName()] = entity[field.getName()];
        }
        responseEntities.push(responseEntity);
    }
    return responseEntities;
}
exports.buildMongooseEntitiesResponse = buildMongooseEntitiesResponse;
//# sourceMappingURL=parser.js.map