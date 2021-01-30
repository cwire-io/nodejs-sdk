import { Document as MongooseDocument, Model as MongooseModel } from 'mongoose';

import { CWire } from '../../CWire';
import { DataModelORM } from '../../DataModelORM';
import { DataModelQuery } from '../../types/DataModelQuery';

import {
  buildMongooseEntitiesResponse,
  parseDataModelQueryToMongooseQuery,
} from './parser';
import MongooseDataModel from './MongooseDataModel';
import { CONSTRUCT_REFERENCES_LOGGER_PREFIX } from '../../helper/logger';
import { DataModel } from '../../DataModel';

export class MongooseDataModelORM extends DataModelORM {
  model: MongooseModel<MongooseDocument>;
  dataModel: MongooseDataModel;

  constructor(
    model: MongooseModel<MongooseDocument>,
    dataModel: MongooseDataModel,
  ) {
    super();
    this.model = model;
    this.dataModel = dataModel;
  }

  async constructReferences(
    cwire: CWire,
    nativeModels: { [key: string]: DataModel },
  ): Promise<any> {
    for (const fieldName of Object.keys(this.model.schema.paths)) {
      try {
        // @ts-ignore
        const ref = mongooseModel.schema.paths[fieldName].options.ref;
        if (nativeModels[ref] && nativeModels[ref].getFieldByName('_id')) {
          this.dataModel.getFieldByName(fieldName).setReference({
            field: '_id',
            model: nativeModels[ref].getName(),
          });
        }
      } catch (error) {
        cwire
          .getLogger()
          .error(
            CONSTRUCT_REFERENCES_LOGGER_PREFIX,
            `Failed to construct reference for ${fieldName} in ${this.dataModel.getName()} with error ${error.toString()}`,
          );
      }
    }
  }

  async create(values: any): Promise<any> {
    const entity = await this.model.create(values);
    return buildMongooseEntitiesResponse(this.dataModel.getFieldsList(), [
      entity,
    ]);
  }

  async count(query: DataModelQuery): Promise<any> {
    if (query && query.group) {
      return this.model
        .aggregate()
        .match(parseDataModelQueryToMongooseQuery(query))
        .group(query.group)
        .exec();
    }

    return this.model.count(parseDataModelQueryToMongooseQuery(query || {}));
  }

  async findAll(query: DataModelQuery): Promise<any> {
    let mongooseQuery = this.model.find(
      parseDataModelQueryToMongooseQuery(query),
    );

    if (query.limit && typeof query.limit === 'number') {
      mongooseQuery = mongooseQuery.limit(query.limit);
    }

    if (query.offset && typeof query.offset === 'number') {
      mongooseQuery = mongooseQuery.skip(query.offset);
    }

    const entities = await mongooseQuery.exec();
    return buildMongooseEntitiesResponse(
      this.dataModel.getFieldsList(),
      entities,
    );
  }

  async findOne(query: DataModelQuery): Promise<any> {
    let mongooseQuery = this.model.findOne(
      parseDataModelQueryToMongooseQuery(query),
    );

    if (query.limit && typeof query.limit === 'number') {
      mongooseQuery = mongooseQuery.limit(query.limit);
    }

    if (query.offset && typeof query.offset === 'number') {
      mongooseQuery = mongooseQuery.skip(query.offset);
    }
    const entity = await mongooseQuery.exec();

    return buildMongooseEntitiesResponse(this.dataModel.getFieldsList(), [
      entity,
    ]);
  }

  async remove(query: DataModelQuery): Promise<any> {
    return this.model.remove(parseDataModelQueryToMongooseQuery(query)).exec();
  }

  async update(query: DataModelQuery, changes: any): Promise<any> {
    const entity = await this.model
      .update(parseDataModelQueryToMongooseQuery(query), changes)
      .exec();

    return buildMongooseEntitiesResponse(this.dataModel.getFieldsList(), [
      entity,
    ]);
  }

  async getName(): Promise<string> {
    return this.model.modelName || 'unknown';
  }
}
