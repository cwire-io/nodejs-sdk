import { Model as MongooseModel, Document as MongooseDocument } from 'mongoose';

import { DataModel } from '../../DataModel';
import { DataModelField } from '../../DataModelField';
import { MissingRequiredPropertyError } from '../../errors';

import { parseMongooseSchemaToCWireDataType } from './parser';
import { MongooseDataModelORM } from './MongooseDataModelORM';

export default class MongooseDataModel extends DataModel {
  constructor(model: MongooseModel<MongooseDocument>) {
    if (!model.modelName) {
      throw new MissingRequiredPropertyError();
    }

    // Extend Default DataModel
    super(model.modelName, {});

    this.model = model;
    this.primaryKey = '_id';
    this.orm = new MongooseDataModelORM(model, this);
    for (const fieldName of Object.keys(this.model.schema.paths)) {
      const field = this.model.schema.paths[fieldName];
      const dataType = parseMongooseSchemaToCWireDataType(field);
      if (dataType !== null) {
        this.fields[fieldName] = new DataModelField(fieldName, {
          type: dataType,
          isPrimary: fieldName === '_id',
        });
      }
    }
  }
}
