"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePrismaDataTypeToCWireDataType = void 0;
function parsePrismaDataTypeToCWireDataType(type) {
    switch (type) {
        case 'String': {
            return 'text';
        }
        case 'Boolean': {
            return 'boolean';
        }
        case 'Float':
        case 'Decimal':
        case 'Int': {
            return 'number';
        }
        case 'DateTime': {
            return 'dateTime';
        }
        default:
            return 'text';
    }
}
exports.parsePrismaDataTypeToCWireDataType = parsePrismaDataTypeToCWireDataType;
//# sourceMappingURL=field.js.map