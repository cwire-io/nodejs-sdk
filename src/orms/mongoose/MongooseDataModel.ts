import { Model as MongooseModel, Document as MongooseDocument } from 'mongoose';

import { CWire } from '../../CWire';
import {
  DATA_MODEL_ENTITY_CREATED_EVENT_LOGGER_PREFIX,
  DATA_MODEL_ENTITY_UPDATED_EVENT_LOGGER_PREFIX,
} from '../../constants/logger';
import { DataModelQuery } from '../../types/DataModelQuery';
import {
  DataModelFieldNotFoundError,
  MissingRequiredPropertyError,
  WrongFieldTypeError,
} from '../../errors';
import { DataModelCalculationFunctions } from '../../types/DataModel';
import { DataModel, DataModelOptions, defaultOptions } from '../../DataModel';
import Logger, {
  CONSTRUCT_REFERENCES_LOGGER_PREFIX,
} from '../../helper/logger';

import { parseSchema } from './field';
import { buildMongooseEntitiesResponse } from './entity';
import { parseWhereQuery } from './query';

export const MongooseType = 'Mongoose';

export type MongooseDataModelOptions = Partial<{} & DataModelOptions>;

/**
 * @property {MongooseModel} model
 * @property {MongooseDataModelOptions} options
 */
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

    const fields = parseSchema(this.model.schema);
    for (const field of fields) {
      this.fields[field.getName()] = field;
    }

    if (!model.prototype.dispatch) {
      const context = this;
      // tslint:disable-next-line:only-arrow-functions
      model.prototype.dispatch = function (
        type: string,
        eventOptions: Partial<{
          after: any;
          before: any;
          icon: string;
          color: string;
          description: string;
        }> = {},
      ) {
        return context.addEntityEvent(
          this[context.getPrimaryKey()],
          type,
          eventOptions,
        );
      };
    }

    if (options.useEntityHistory) {
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
            Logger.system(
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
          Logger.system(
            DATA_MODEL_ENTITY_CREATED_EVENT_LOGGER_PREFIX,
            // @ts-ignore
            `Log creating of ${dataModel.getName()} entity ${this._id}`,
          );
        } catch (error) {
          Logger.error(
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
        const ref = this.model.schema.paths[fieldName].options.ref;
        if (nativeModels[ref] && nativeModels[ref].getFieldByName('_id')) {
          this.getFieldByName(fieldName).setReference({
            field: '_id',
            type: 'many',
            model: await nativeModels[ref].getName(),
          });
        }
      } catch (error) {
        Logger.error(
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
      const aggregation = this.model
        .aggregate()
        .match(parseWhereQuery(this, query?.where));

      // TODO: Support multiple groups for aggregation
      const [field] = query.group;
      aggregation.group({ _id: `$${field}`, total: { $sum: 1 } });
      const results = await aggregation.exec();

      const response = [];
      for (const result of results) {
        response.push({ [field]: result._id, count: result.total });
      }

      return response;
    }

    return this.model.count(parseWhereQuery(this, query?.where || {}));
  }

  async findAll(cwire: CWire, query: DataModelQuery): Promise<any> {
    let mongooseQuery = this.model.find(parseWhereQuery(this, query?.where));

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
    let mongooseQuery = this.model.findOne(parseWhereQuery(this, query?.where));

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
    return this.model.remove(parseWhereQuery(this, query?.where)).exec();
  }

  async update(
    cwire: CWire,
    query: DataModelQuery,
    changes: any,
  ): Promise<any> {
    const entity = await this.model
      .update(parseWhereQuery(this, query?.where), changes)
      .exec();
    return buildMongooseEntitiesResponse(this.getFieldsList(), [entity]);
  }

  async calculate(
    cwire: CWire,
    calcFn: DataModelCalculationFunctions,
    fieldName: string,
    query: DataModelQuery,
  ): Promise<any> {
    const field = this.getFieldsMap()[fieldName];

    if (!field) {
      throw new DataModelFieldNotFoundError();
    }

    if (
      field.getType() !== 'number' &&
      field.getType() !== 'date' &&
      field.getType() !== 'dateTime' &&
      field.getType() !== 'timestamp'
    ) {
      throw new WrongFieldTypeError();
    }

    const id = query.group ? `$${query.group[0]}` : null;
    const aggregatedField = `$${fieldName}`;
    const aggregation = this.model
      .aggregate()
      .match(parseWhereQuery(this, query?.where));

    switch (calcFn) {
      case DataModelCalculationFunctions.AVG: {
        aggregation.group({ _id: id, value: { $avg: aggregatedField } });
        break;
      }
      case DataModelCalculationFunctions.SUM: {
        aggregation.group({ _id: id, value: { $sum: aggregatedField } });
        break;
      }
      case DataModelCalculationFunctions.MAX: {
        aggregation.group({ _id: id, value: { $max: aggregatedField } });
        break;
      }
      case DataModelCalculationFunctions.MIN: {
        aggregation.group({ _id: id, value: { $min: aggregatedField } });
        break;
      }
    }

    const results = await aggregation.exec();

    if (query.group) {
      const response = [];
      for (const result of results) {
        // @ts-ignore
        response.push({ [query.group[0]]: result._id, value: result.value });
      }

      return response;
    }

    return results[0].value;
  }
}
