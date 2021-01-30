import { CWire } from './CWire';
import { DataModelQuery } from './types/DataModelQuery';

import { DataModel } from './DataModel';

export abstract class DataModelORM<Schema = any> {
  public abstract async constructReferences(
    cwire: CWire,
    nativeModels: { [key: string]: DataModel },
  ): Promise<any>;
  public abstract async getName(): Promise<string>;
  public abstract async create(values: Schema): Promise<any>;
  public abstract async count(query: DataModelQuery): Promise<any>;
  public abstract async remove(query: DataModelQuery): Promise<any>;
  public abstract async findOne(query: DataModelQuery): Promise<any>;
  public abstract async findAll(query: DataModelQuery): Promise<any>;
  public abstract async update(
    query: DataModelQuery,
    changes: Schema,
  ): Promise<any>;
}
