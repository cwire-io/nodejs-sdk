import { DataModel } from '../../DataModel';
import { DataModelField } from '../../DataModelField';
import { parseSequelizeDataTypeToCWireDataType } from './parser';
import { BaseDataModelFieldOptions } from '../../types/DataModelFields';

export type SequelizeModel = any;
export default class SequelizeDataModel extends DataModel {
  constructor(model: SequelizeModel) {
    super(model.getTableName(), {
      type: 'Sequelize',
    });

    this.model = model;
    for (const sequelizeField of Object.values(
      this.model.rawAttributes,
    ) as any) {
      if (sequelizeField.field) {
        if (sequelizeField.primaryKey) {
          this.primaryKey = sequelizeField.field;
        }

        const fieldOptions: BaseDataModelFieldOptions = {
          isPrimary: sequelizeField.primaryKey,
          type: parseSequelizeDataTypeToCWireDataType(sequelizeField.type),
        };

        this.fields[sequelizeField.field] = new DataModelField(
          sequelizeField.field,
          fieldOptions,
        );
      }
    }
  }
}
