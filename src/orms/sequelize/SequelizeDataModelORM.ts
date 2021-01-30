import { CWire } from '../../CWire';
import { DataModel } from '../../DataModel';
import { DataModelORM } from '../../DataModelORM';
import { DataModelQuery } from '../../types/DataModelQuery';

import {
  buildEntitiesResponse,
  parseDataModelQueryToSequelizeQuery,
} from './parser';
import SequelizeDataModel, { SequelizeModel } from './SequelizeDataModel';
import { CONSTRUCT_REFERENCES_LOGGER_PREFIX } from '../../helper/logger';

export default class SequelizeDataModelORM extends DataModelORM {
  model: SequelizeModel;
  dataModel: SequelizeDataModel;

  constructor(model: SequelizeModel, dataModel: SequelizeDataModel) {
    super();
    this.model = model;
    this.dataModel = dataModel;
  }

  async constructReferences(
    cwire: CWire,
    nativeModels: { [key: string]: DataModel },
  ): Promise<any> {
    for (const sequelizeField of Object.values(
      this.model.rawAttributes,
    ) as any) {
      try {
        if (sequelizeField.references) {
          const { model: modelName, key: field } = sequelizeField.references;
          if (
            nativeModels[modelName] &&
            this.dataModel.getFieldByName(sequelizeField.field)
          ) {
            this.dataModel.getFieldByName(sequelizeField.field).setReference({
              field,
              model: nativeModels[modelName].getName(),
            });
          }
        }
      } catch (error) {
        cwire
          .getLogger()
          .error(
            CONSTRUCT_REFERENCES_LOGGER_PREFIX,
            `Failed to construct reference for ${
              sequelizeField.field
            } in ${this.dataModel.getName()} with error ${error.toString()}`,
          );
      }
    }
  }

  async count(query: DataModelQuery): Promise<any> {
    const numberOfEntities = this.model.count(
      parseDataModelQueryToSequelizeQuery(query),
    );
    return numberOfEntities || 0;
  }

  async create(values: any): Promise<any> {
    const entity = await this.model.create(values);
    return buildEntitiesResponse(this.dataModel.getFieldsList(), [entity]);
  }

  async findAll(query: DataModelQuery): Promise<any> {
    const entities = await this.model.findAll(
      parseDataModelQueryToSequelizeQuery(query),
    );
    return buildEntitiesResponse(this.dataModel.getFieldsList(), entities);
  }

  async findOne(query: DataModelQuery): Promise<any> {
    const entity = await this.model.findOne(
      parseDataModelQueryToSequelizeQuery(query),
    );

    if (!entity) {
      return null;
    }
    return buildEntitiesResponse(this.dataModel.getFieldsList(), [entity]);
  }

  async remove(query: DataModelQuery): Promise<any> {
    return this.model.destroy(parseDataModelQueryToSequelizeQuery(query));
  }

  async update(query: DataModelQuery, changes: any): Promise<any> {
    const entity = await this.model.findOne(
      parseDataModelQueryToSequelizeQuery(query),
    );

    if (!entity) {
      return null;
    }

    await entity.update(changes);
    return {
      success: true,
      data: buildEntitiesResponse(this.dataModel.getFieldsList(), [entity]),
    };
  }

  async getName(): Promise<string> {
    return this.model.getTableName();
  }
}
