import { keys } from 'ts-transformer-keys';

import { CWire } from '../../CWire';
import { DataModelField } from '../../DataModelField';
import { DataModelQuery } from '../../types/DataModelQuery';
import { DataModelFieldOptionsType } from '../../types/DataModelFields';
import Logger, {
  CONSTRUCT_REFERENCES_LOGGER_PREFIX,
} from '../../helper/logger';
import { DuplicatedOptionsParsedError } from '../../errors';
import { DataModelCalculationFunctions } from '../../types/DataModel';
import { DataModel, DataModelOptions, defaultOptions } from '../../DataModel';

import { parseQueryToPrisma } from './query';
import { buildEntitiesResponse } from './entity';
import { parsePrismaDataTypeToCWireDataType } from './field';
import { query } from 'express';

export const PrismaType = 'Prisma';
export default class PrismaDataModel<Schema = any> extends DataModel<Schema> {
  private prisma: any;
  private model: any;

  protected static getPrismaSettings(prisma: any): any {
    return prisma._dmmf;
  }

  constructor(model: any, prisma: any, options: DataModelOptions) {
    super(model.name, options);

    this.model = model;
    this.prisma = prisma;

    for (const field of model.fields) {
      if (field.relationFromFields) {
        continue;
      }

      this.fields[field.name] = new DataModelField(field.name, {
        type: parsePrismaDataTypeToCWireDataType(field.type),
        isPrimary: field.isId,
        isUnique: field.isUnique,
        isReadonly: field.isReadonly,
        isNullable: field.hasDefaultValue && field.default === null,
        ...(field.hasDefaultValue ? { defaultValue: field.default } : {}),
      });
    }

    /*
    TODO: Support multiple primary keys
     */
    if (model.primaryKey && model.primaryKey.fields) {
      for (const fieldName of model.primaryKey.fields) {
        if (this.fields[fieldName]) {
          this.fields[fieldName].setPrimaryField(true);
        }
      }
    }
  }

  public static parse(
    prisma: any,
    options: Partial<
      {
        blacklist: string[];
        whitelist: string[];
      } & DataModelOptions
    >,
  ) {
    if (options.blacklist && options.whitelist) {
      throw new DuplicatedOptionsParsedError();
    }

    let {
      datamodel: { models },
    } = PrismaDataModel.getPrismaSettings(prisma);

    if (options.whitelist) {
      models = models.filter((model: any) =>
        (options.whitelist || []).includes(model.name),
      );
    }

    if (options.blacklist) {
      models = models.filter(
        (model: any) => !(options.blacklist || []).includes(model.name),
      );
    }

    return models.map(
      (model: any) => new PrismaDataModel(model, prisma, options),
    );
  }

  async constructReferences(
    cwire: CWire,
    nativeModels: Record<string, DataModel>,
  ): Promise<any> {
    for (const field of this.model.fields) {
      if (!field.relationFromFields) {
        continue;
      }

      // tslint:disable-next-line:forin
      for (const index in field.relationFromFields) {
        const fieldName = field.relationFromFields[index];
        if (this.getFieldByName(fieldName)) {
          this.getFieldByName(fieldName).setReference({
            type: 'one',
            model: field.type,
            field: field.relationToFields[index],
          });
        }
      }
    }
  }

  getName(): string {
    return this.model.name;
  }

  getType(): string {
    return PrismaType;
  }

  getPrismaModelName(): string {
    return this.getName().charAt(0).toLowerCase() + this.getName().slice(1);
  }

  async count(cwire: CWire, query: DataModelQuery): Promise<any> {
    const {
      _count: { _all: result },
    } = await this.prisma[this.getPrismaModelName()].aggregate({
      ...parseQueryToPrisma(this, query),
      _count: { _all: true },
    });
    return result;
  }

  async create(cwire: CWire, values: Schema): Promise<any> {
    const result = await this.prisma[this.getPrismaModelName()].create({
      data: values,
    });
    return buildEntitiesResponse(this.getFieldsList(), [result]);
  }

  async findAll(cwire: CWire, query: DataModelQuery): Promise<any> {
    const results = await this.prisma[this.getPrismaModelName()].findMany(
      parseQueryToPrisma(this, query),
    );
    return buildEntitiesResponse(this.getFieldsList(), results);
  }

  async findOne(cwire: CWire, query: DataModelQuery): Promise<any> {
    const result = await this.prisma[this.getPrismaModelName()].findFirst(
      parseQueryToPrisma(this, query),
    );
    return buildEntitiesResponse(this.getFieldsList(), [result]);
  }

  async remove(cwire: CWire, query: DataModelQuery): Promise<any> {
    return this.prisma[this.getPrismaModelName()].deleteMany(
      parseQueryToPrisma(this, query),
    );
  }

  async update(
    cwire: CWire,
    query: DataModelQuery,
    changes: Schema,
  ): Promise<any> {
    const { count } = await this.prisma[this.getPrismaModelName()].updateMany({
      ...parseQueryToPrisma(this, query),
      data: changes,
    });

    if (count === 0) {
      return [];
    }

    return this.findAll(cwire, query);
  }

  async calculate(
    cwire: CWire,
    calcFn: DataModelCalculationFunctions,
    fieldName: string,
    query: DataModelQuery,
  ): Promise<any> {
    let calculationKey: string;

    switch (calcFn) {
      case DataModelCalculationFunctions.AVG: {
        calculationKey = '_avg';
        break;
      }
      case DataModelCalculationFunctions.MAX: {
        calculationKey = '_max';
        break;
      }
      case DataModelCalculationFunctions.MIN: {
        calculationKey = '_min';
        break;
      }
      case DataModelCalculationFunctions.SUM: {
        calculationKey = '_sum';
        break;
      }
    }

    if (query.group) {
      const results = await this.prisma[this.getPrismaModelName()].groupBy({
        ...parseQueryToPrisma(this, query),
        by: query.group,
        [calculationKey]: {
          [fieldName]: true,
        },
      });

      return results.map((result: any) => ({
        value: result[calculationKey][fieldName],
        // @ts-ignore
        [query.group[0]]: result[query.group[0]],
      }));
    }

    const result = await this.prisma[this.getPrismaModelName()].aggregate({
      ...parseQueryToPrisma(this, query),
      [calculationKey]: {
        [fieldName]: true,
      },
    });

    return result[calculationKey][fieldName];
  }
}
