"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMongooseEntitiesResponse = void 0;
function buildMongooseEntitiesResponse(fields, entities) {
    const responseEntities = [];
    for (const entity of entities) {
        const responseEntity = {};
        for (const field of fields) {
            const fieldPath = field.getName().split('.');
            if (fieldPath.length === 1) {
                responseEntity[field.getName()] = entity[field.getName()];
                continue;
            }
            let subDocument = entity;
            for (let index = 0; index < fieldPath.length; index++) {
                const fieldPathPart = fieldPath[index];
                if (subDocument && subDocument[fieldPathPart]) {
                    subDocument = subDocument[fieldPathPart];
                    if (index === fieldPath.length - 1) {
                        responseEntity[field.getName()] = subDocument;
                    }
                }
            }
        }
        responseEntities.push(responseEntity);
    }
    return responseEntities;
}
exports.buildMongooseEntitiesResponse = buildMongooseEntitiesResponse;
//# sourceMappingURL=entity.js.map