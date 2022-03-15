"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEntitiesResponse = void 0;
function buildEntitiesResponse(fields, entities) {
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
exports.buildEntitiesResponse = buildEntitiesResponse;
//# sourceMappingURL=entity.js.map