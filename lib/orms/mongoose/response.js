"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMongooseEntitiesResponse = void 0;
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
//# sourceMappingURL=response.js.map