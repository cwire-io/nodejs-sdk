import { Model as MongooseModel, Document as MongooseDocument } from 'mongoose';

import { CWire } from '../../CWire';
import { DataModel } from '../../DataModel';
import { DataModelField } from '../../DataModelField';
import { MissingRequiredPropertyError } from '../../errors';
import { DataModelQuery } from '../../types/DataModelQuery';
import { CONSTRUCT_REFERENCES_LOGGER_PREFIX } from '../../helper/logger';

import {
  buildMongooseEntitiesResponse,
  parseDataModelQueryToMongooseQuery,
  parseMongooseSchemaToCWireDataType,
} from './parser';

export const MongooseType = 'Mongoose';

export default class MongooseDataModel<Schema = any> extends DataModel<Schema> {
  protected model: MongooseModel<MongooseDocument>;

  constructor(model: MongooseModel<MongooseDocument>) {
    // Extend Default DataModel
    super(model.modelName || 'unknown', {});

    if (!model.modelName) {
      throw new MissingRequiredPropertyError();
    }

    this.model = model;
    this.primaryKey = '_id';
    for (const fieldName of Object.keys(this.model.schema.paths)) {
      const field = this.model.schema.paths[fieldName];
      const dataType = parseMongooseSchemaToCWireDataType(field);
      if (dataType !== null) {
        // @ts-ignore
        this.fields[fieldName] = new DataModelField(fieldName, {
          type: dataType,
          isPrimary: fieldName === '_id',
        });
      }
    }
  }

  getName(): string {
    return this.model.modelName || 'unknown';
  }

  public getType(): string {
    return MongooseType;
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
          this.getFieldByName(fieldName).setReference({
            field: '_id',
            model: await nativeModels[ref].getName(),
          });
        }
      } catch (error) {
        cwire
          .getLogger()
          .error(
            CONSTRUCT_REFERENCES_LOGGER_PREFIX,
            `Failed to construct reference for ${fieldName} in ${this.getName()} with error ${error.toString()}`,
          );
      }
    }
  }

  async create(cwire: CWire, values: any): Promise<any> {
    const entity = await this.model.create(values);
    return buildMongooseEntitiesResponse(this.getFieldsList(), [entity]);
  }

  async count(cwire: CWire, query: DataModelQuery): Promise<any> {
    if (query && query.group) {
      return this.model
        .aggregate()
        .match(parseDataModelQueryToMongooseQuery(query))
        .group(query.group)
        .exec();
    }

    return this.model.count(parseDataModelQueryToMongooseQuery(query || {}));
  }

  async findAll(cwire: CWire, query: DataModelQuery): Promise<any> {
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
    return buildMongooseEntitiesResponse(this.getFieldsList(), entities);
  }

  async findOne(cwire: CWire, query: DataModelQuery): Promise<any> {
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

    return buildMongooseEntitiesResponse(this.getFieldsList(), [entity]);
  }

  async remove(cwire: CWire, query: DataModelQuery): Promise<any> {
    return this.model.remove(parseDataModelQueryToMongooseQuery(query)).exec();
  }

  async update(
    cwire: CWire,
    query: DataModelQuery,
    changes: any,
  ): Promise<any> {
    const entity = await this.model
      .update(parseDataModelQueryToMongooseQuery(query), changes)
      .exec();

    return buildMongooseEntitiesResponse(this.getFieldsList(), [entity]);
  }
}
