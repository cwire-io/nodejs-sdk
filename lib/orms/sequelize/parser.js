"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEntitiesResponse = exports.parseSequelizeDataTypeToCWireDataType = exports.parseDataModelQueryToSequelizeQuery = exports.parseSequelizeIncludingParsing = void 0;
const sequelize_1 = require("sequelize");
function parseSequelizeDataTypeStringToCWireDataType(type) {
    switch (type) {
        case sequelize_1.DataTypes.CHAR.key:
        case sequelize_1.DataTypes.STRING.key:
        case sequelize_1.DataTypes.TEXT.key:
            return 'text';
        case sequelize_1.DataTypes.BOOLEAN.key:
            return 'boolean';
        case sequelize_1.DataTypes.INTEGER.key:
        case sequelize_1.DataTypes.DOUBLE.key:
        case sequelize_1.DataTypes.FLOAT.key:
            return 'number';
        case sequelize_1.DataTypes.DATEONLY.key:
            return 'date';
        case sequelize_1.DataTypes.DATE.key:
            return 'dateTime';
        default:
            return 'text';
    }
}
function parseSequelizeIncludingParsing(cwire, baseModel, query, sequelizeQuery) {
    const parsedIncludes = {};
    for (const reference of query.include || []) {
        if (baseModel.getReferences()[reference]) {
            if (cwire.getDataModelByName(reference) &&
                cwire.getDataModelByName(reference).getType() === baseModel.getType()) {
                const referencingModel = cwire.getDataModelByName(reference);
                let association = null;
                for (const modelAssociation of Object.values(baseModel.getModel().associations)) {
                    if (modelAssociation.source.name === baseModel.getModel().model.name &&
                        modelAssociation.target.name === referencingModel.getModel().name) {
                        association = modelAssociation;
                        break;
                    }
                }
                if (association) {
                    parsedIncludes[reference] = {
                        key: association.as,
                        model: referencingModel,
                    };
                    sequelizeQuery.include.push({
                        as: association.as,
                        model: referencingModel.getModel(),
                    });
                }
            }
        }
    }
    return { sequelizeQuery, parsedIncludes };
}
exports.parseSequelizeIncludingParsing = parseSequelizeIncludingParsing;
function parseDataModelQueryToSequelizeQuery(query) {
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
        sequelizeQuery.where = {};
        for (const key of Object.keys(query.where)) {
            if (typeof query.where[key] === 'number' ||
                typeof query.where[key] === 'string') {
                sequelizeQuery.where[key] = query.where[key];
                continue;
            }
            if (typeof query.where[key] === 'object') {
                sequelizeQuery.where[key] = {};
                if (query.where[key].$like &&
                    typeof query.where[key].$like === 'string') {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.like]: query.where[key].$like });
                }
                if (query.where[key].$notLike &&
                    typeof query.where[key].$notLike === 'string') {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.notLike]: query.where[key].$notLike });
                }
                if (query.where[key].$iLike &&
                    typeof query.where[key].$iLike === 'string') {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.iLike]: query.where[key].$iLike });
                }
                if (query.where[key].$regex &&
                    typeof query.where[key].$regex === 'string') {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.regexp]: query.where[key].$regex });
                }
                if (query.where[key].$notRegex &&
                    typeof query.where[key].$notRegex === 'string') {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.notLike]: query.where[key].$notLike });
                }
                if ((query.where[key].$notEqual &&
                    typeof query.where[key].$notEqual === 'string') ||
                    typeof query.where[key].$notEqual === 'number') {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.ne]: query.where[key].$notEqual });
                }
                if (query.where[key].$equal &&
                    (typeof query.where[key].$equal === 'string' ||
                        typeof query.where[key].$equal === 'number')) {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.eq]: query.where[key].$equal });
                }
                if (query.where[key].$or && Array.isArray(query.where[key].$or)) {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.or]: query.where[key].$or });
                }
                if (query.where[key].$between &&
                    Array.isArray(query.where[key].$between)) {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.between]: query.where[key].$between });
                }
                if (query.where[key].$notBetween &&
                    Array.isArray(query.where[key].$notBetween)) {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.notBetween]: query.where[key].$notBetween });
                }
                if (query.where[key].$lower &&
                    typeof query.where[key].$lower === 'number') {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.lt]: query.where[key].$lower });
                }
                if (query.where[key].$lowerOrEqual &&
                    typeof query.where[key].$lowerOrEqual === 'number') {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.lte]: query.where[key].$lowerOrEqual });
                }
                if (query.where[key].$higher &&
                    typeof query.where[key].$higher === 'number') {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.gt]: query.where[key].$higher });
                }
                if (query.where[key].$higherOrEqual &&
                    typeof query.where[key].$higherOrEqual === 'number') {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.gte]: query.where[key].$higherOrEqual });
                }
                if (query.where[key].$in && Array.isArray(query.where[key].$in)) {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.in]: query.where[key].$in });
                }
                if (query.where[key].$notIn && Array.isArray(query.where[key].$notIn)) {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.notIn]: query.where[key].$notIn });
                }
                if (query.where[key].$is &&
                    (typeof query.where[key].$is === 'string' ||
                        typeof query.where[key].$is === 'number')) {
                    sequelizeQuery.where[key] = Object.assign(Object.assign({}, sequelizeQuery.where[key]), { [sequelize_1.Op.is]: query.where[key].$is });
                }
            }
        }
    }
    return sequelizeQuery;
}
exports.parseDataModelQueryToSequelizeQuery = parseDataModelQueryToSequelizeQuery;
function parseSequelizeDataTypeToCWireDataType(dataType) {
    if (typeof dataType === 'string') {
        return parseSequelizeDataTypeStringToCWireDataType(dataType);
    }
    return parseSequelizeDataTypeStringToCWireDataType(dataType.key);
}
exports.parseSequelizeDataTypeToCWireDataType = parseSequelizeDataTypeToCWireDataType;
function buildEntitiesResponse(fields, entities) {
    const responseEntities = [];
    for (const entity of entities) {
        const responseEntity = {};
        for (const field of fields) {
            responseEntity[field.getName()] = entity.get(field.getName());
        }
        responseEntities.push(responseEntity);
    }
    return responseEntities;
}
exports.buildEntitiesResponse = buildEntitiesResponse;
//# sourceMappingURL=parser.js.map