import { DataModelField, DataModelFieldType } from '../..';

const GENERIC_MONGOOSE_FIELD_MAP: { [key: string]: DataModelFieldType } = {
  ObjectId: 'text',
  SchemaString: 'text',
  SchemaNumber: 'number',
  SchemaDate: 'timestamp',
  SchemaBoolean: 'boolean',
};

function parseFieldTypeToCWire(type: string): DataModelFieldType | null {
  if (GENERIC_MONGOOSE_FIELD_MAP[type]) {
    return GENERIC_MONGOOSE_FIELD_MAP[type];
  }

  // TODO: FIX DATA PARSING
  if (type === 'SchemaDate') {
    return 'text';
  }

  return null;
}

function getFieldType(field: any): string | null {
  if (field.type && field.type.name) {
    return field.type.name;
  } else if (field.type) {
    return getFieldType(field.type);
  } else if (field.constructor.name) {
    switch (field.constructor.name) {
      case 'Array': {
        if (field.length > 0) {
          const details = field[0];
          const isNameSchemaProperty =
            ['object', 'function'].indexOf(typeof details.name) !== -1;
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

export function parseSchema(
  schema: any,
  baseFieldName: string | null = null,
): DataModelField[] {
  const fields = [];
  for (const schemaFieldName of Object.keys(schema.paths)) {
    const schemaField = schema.paths[schemaFieldName];
    const fieldName =
      typeof baseFieldName === 'string'
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

    fields.push(
      new DataModelField(fieldName, {
        // @ts-ignore
        type: dataType,
        isPrimary: fieldName === '_id',
      }),
    );

    // TODO: ADD MISSING ARRAY
  }
  return fields;
}
