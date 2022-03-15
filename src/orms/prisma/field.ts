import { DataModelFieldType } from '../../types/DataModelFields';

export function parsePrismaDataTypeToCWireDataType(
  type: string,
): DataModelFieldType {
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
