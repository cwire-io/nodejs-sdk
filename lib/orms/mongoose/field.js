"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSchema = void 0;
const __1 = require("../..");
const GENERIC_MONGOOSE_FIELD_MAP = {
    ObjectId: 'text',
    SchemaString: 'text',
    SchemaNumber: 'number',
    SchemaDate: 'timestamp',
    SchemaBoolean: 'boolean',
};
function parseFieldTypeToCWire(type) {
    if (GENERIC_MONGOOSE_FIELD_MAP[type]) {
        return GENERIC_MONGOOSE_FIELD_MAP[type];
    }
    if (type === 'SchemaDate') {
        return 'text';
    }
    return null;
}
function getFieldType(field) {
    if (field.type && field.type.name) {
        return field.type.name;
    }
    else if (field.type) {
        return getFieldType(field.type);
    }
    else if (field.constructor.name) {
        switch (field.constructor.name) {
            case 'Array': {
                if (field.length > 0) {
                    const details = field[0];
                    const isNameSchemaProperty = ['object', 'function'].indexOf(typeof details.name) !== -1;
                    let arrayContentType = !isNameSchemaProperty
                        ? details.name
                        : undefined;
                    if (!arrayContentType) {
                        arrayContentType =
                            details.constructor.name === 'Object'
                                ? getFieldType(details)
                                : details.constructor.name;
                    }
                    return `ArrayOf${arrayContentType}`;
                }
                return null;
            }
            case 'Function': {
                return field.name;
            }
            case 'Object': {
                return Object.keys(field).length > 0 ? 'Object' : 'Schema';
            }
            default:
                return field.constructor.name;
        }
    }
    return null;
}
function parseSchema(schema, baseFieldName = null) {
    const fields = [];
    for (const schemaFieldName of Object.keys(schema.paths)) {
        const schemaField = schema.paths[schemaFieldName];
        const fieldName = typeof baseFieldName === 'string'
            ? `${baseFieldName}.${schemaFieldName}`
            : schemaFieldName;
        const fieldType = getFieldType(schemaField);
        if (fieldType === null) {
            continue;
        }
        if (fieldType === 'SingleNestedPath') {
            const parsedFields = parseSchema(schemaField.schema, fieldName);
            for (const parsedField of parsedFields) {
                fields.push(parsedField);
            }
            continue;
        }
        const dataType = parseFieldTypeToCWire(fieldType);
        if (dataType === null) {
            continue;
        }
        fields.push(new __1.DataModelField(fieldName, {
            type: dataType,
            isPrimary: fieldName === '_id',
        }));
    }
    return fields;
}
exports.parseSchema = parseSchema;
//# sourceMappingURL=field.js.map