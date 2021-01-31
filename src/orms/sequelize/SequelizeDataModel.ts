import { CWire } from '../../CWire';
import { DataModel } from '../../DataModel';
import { DataModelField } from '../../DataModelField';
import { DataModelQuery } from '../../types/DataModelQuery';
import { DataModelFieldOptionsType } from '../../types/DataModelFields';
import { CONSTRUCT_REFERENCES_LOGGER_PREFIX } from '../../helper/logger';

import {
  buildEntitiesResponse,
  parseDataModelQueryToSequelizeQuery,
  parseSequelizeDataTypeToCWireDataType,
  parseSequelizeIncludingParsing,
} from './parser';
import * as util from 'util';

export type SequelizeModel = any;
export const SequelizeType = 'Sequelize';

export default class SequelizeDataModel<
  Schema = any
> extends DataModel<Schema> {
  protected model: SequelizeModel;

  constructor(model: SequelizeModel) {
    super(model.getTableName(), {});

    this.model = model;
    for (const sequelizeField of Object.values(
      this.model.rawAttributes,
    ) as any) {
      if (sequelizeField.field) {
        if (sequelizeField.primaryKey) {
          this.primaryKey = sequelizeField.field;
        }

        // @ts-ignore
        const fieldOptions: DataModelFieldOptionsType = {
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

  public getName(): string {
    return this.model.getTableName();
  }

  public getType(): string {
    return SequelizeType;
  }

  public async constructReferences(
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
            this.getFieldByName(sequelizeField.field)
          ) {
            this.getFieldByName(sequelizeField.field).setReference({
              field,
              model: await nativeModels[modelName].getName(),
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
            } in ${this.getName()} with error ${error.toString()}`,
          );
      }
    }
  }

  public async count(cwire: CWire, query: DataModelQuery): Promise<any> {
    const numberOfEntities = this.model.count(
      parseDataModelQueryToSequelizeQuery(query),
    );
    return numberOfEntities || 0;
  }

  public async create(cwire: CWire, values: any): Promise<any> {
    const entity = await this.model.create(values);
    return buildEntitiesResponse(this.getFieldsList(), [entity]);
  }

  public async findAll(cwire: CWire, query: DataModelQuery): Promise<any> {
    const entities = await this.model.findAll(
      parseDataModelQueryToSequelizeQuery(query),
    );
    return buildEntitiesResponse(this.getFieldsList(), entities);
  }

  public getModel(): SequelizeModel {
    return this.model;
  }

  public async findOne(cwire: CWire, query: DataModelQuery): Promise<any> {
    const parsedQuery = parseDataModelQueryToSequelizeQuery(query);
    const { sequelizeQuery, parsedIncludes } = parseSequelizeIncludingParsing(
      cwire,
      this,
      query,
      parsedQuery,
    );

    // TODO Implement cloud including
    /*
    if (query.include) {
      for (const reference of query.include) {
        if (this.getReferences()[reference]) {
          if (
            cwire.getDataModelByName(reference) &&
            cwire.getDataModelByName(reference).getType() === this.getType()
          ) {
            // @ts-ignore
            const referencingModel: SequelizeDataModel = cwire.getDataModelByName(
              reference,
            );
            if (!parsedQuery.include) {
              parsedQuery.include = [];
            }

            let association = null;
            for (const modelAssociation of Object.values<any>(
              this.model.associations,
            )) {
              if (
                modelAssociation.source.name === this.model.name &&
                modelAssociation.target.name === referencingModel.model.name
              ) {
                association = modelAssociation;
                break;
              }
            }

            if (association) {
              sequelizeIncludes.push({
                key: association.as,
                model: referencingModel,
              });
              parsedQuery.include.push({
                as: association.as,
                model: referencingModel.model,
              });
            }
          }
        }
      }
    }
    */
    const entity = await this.model.findOne(parsedQuery);

    if (!entity) {
      return null;
    }

    return buildEntitiesResponse(this.getFieldsList(), [entity]);
  }

  public async remove(cwire: CWire, query: DataModelQuery): Promise<any> {
    return this.model.destroy(parseDataModelQueryToSequelizeQuery(query));
  }

  public async update(
    cwire: CWire,
    query: DataModelQuery,
    changes: any,
  ): Promise<any> {
    const entity = await this.model.findOne(
      parseDataModelQueryToSequelizeQuery(query),
    );

    if (!entity) {
      return null;
    }

    await entity.update(changes);
    return {
      success: true,
      data: buildEntitiesResponse(this.getFieldsList(), [entity]),
    };
  }
}
