import { Model as MongooseModel, Document as MongooseDocument } from 'mongoose';

import { CWire } from '../../CWire';
import { DataModelField } from '../../DataModelField';
import { MissingRequiredPropertyError } from '../../errors';
import { DataModelQuery } from '../../types/DataModelQuery';
import { CONSTRUCT_REFERENCES_LOGGER_PREFIX } from '../../helper/logger';
import { DataModel, DataModelOptions, defaultOptions } from '../../DataModel';

import {
  buildMongooseEntitiesResponse,
  parseDataModelQueryToMongooseQuery,
  parseMongooseSchemaToCWireDataType,
} from './parser';
import {
  DATA_MODEL_ENTITY_CREATED_EVENT_LOGGER_PREFIX,
  DATA_MODEL_ENTITY_UPDATED_EVENT_LOGGER_PREFIX,
} from '../../constants/logger';

export const MongooseType = 'Mongoose';

export type MongooseDataModelOptions = Partial<{} & DataModelOptions>;

export default class MongooseDataModel<Schema = any> extends DataModel<Schema> {
  protected model: MongooseModel<MongooseDocument>;

  constructor(
    model: MongooseModel<MongooseDocument>,
    options: MongooseDataModelOptions = {
      ...defaultOptions,
    },
  ) {
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

    if (options.useEntityHistory) {
      /*
Issue for on update and delete query -> the execution functions are wrapped by a filtered hooks on create
https://github.com/Automattic/mongoose/blob/1af55feb27705524bc20a66d6a0648d6ecd5f677/lib/helpers/query/applyQueryMiddleware.js
https://github.com/vkarpov15/kareem/blob/master/index.js#L332

// @ts-ignore
console.dir(model.Query.base.update);
// @ts-ignore
console.dir(model.Query.base);

// @ts-ignore
// tslint:disable-next-line:only-arrow-functions
model.hooks.pre('update', function (next) {
  next();
  console.log('update');
  // console.dir(this);
});
// @ts-ignore
// tslint:disable-next-line:only-arrow-functions
model.hooks.pre('updateOne', function (next) {
  console.log('updateOne');
  next();
});
// @ts-ignore
// tslint:disable-next-line:only-arrow-functions
model._middleware.pre('updateOne', function (next) {
  console.log('updateOne');
  next();
});
// tslint:disable-next-line:only-arrow-functions
model.schema.pre('updateOne', function (next) {
  console.log('updateOne');
  next();
});
*/

      const dataModel = this;
      // @ts-ignore
      model._middleware.pre('save', async function () {
        try {
          // @ts-ignore
          if (this.isNew) {
            await CWire.getInstance()
              .getAPI()
              .getDataModelAPI()
              // @ts-ignore
              .addEvent('CREATED', this._id, dataModel, {
                // @ts-ignore
                after: this,
              });
            CWire.getInstance().getLogger().system(
              DATA_MODEL_ENTITY_CREATED_EVENT_LOGGER_PREFIX,
              // @ts-ignore
              `Log creating of ${dataModel.getName()} entity ${this._id}`,
            );
            return;
          }
          // @ts-ignore
          await CWire.getInstance()
            .getAPI()
            .getDataModelAPI()
            // @ts-ignore
            .addEvent('UPDATED', this._id, dataModel, {
              // @ts-ignore
              after: this,
              // @ts-ignore
              before: this.original,
            });
          CWire.getInstance().getLogger().system(
            DATA_MODEL_ENTITY_CREATED_EVENT_LOGGER_PREFIX,
            // @ts-ignore
            `Log creating of ${dataModel.getName()} entity ${this._id}`,
          );
        } catch (error) {
          CWire.getInstance()
            .getLogger()
            .error(
              // @ts-ignore
              this.isNew
                ? DATA_MODEL_ENTITY_CREATED_EVENT_LOGGER_PREFIX
                : DATA_MODEL_ENTITY_UPDATED_EVENT_LOGGER_PREFIX,
              `Error by logging ${error.toString()}`,
            );
        }
      });
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
            type: 'many',
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
