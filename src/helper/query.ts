import moment from 'moment';
import { DataModelField } from '../DataModelField';

export function parseFieldValue(field: DataModelField, value: any) {
  switch (field.getType()) {
    case 'date':
    case 'dateTime':
    case 'timestamp': {
      return moment(value).toDate();
    }
    default:
      return value;
  }
}
