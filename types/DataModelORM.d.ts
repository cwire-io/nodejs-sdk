import { CWire } from './CWire';
import { DataModelQuery } from './types/DataModelQuery';
import { DataModel } from './DataModel';
export declare abstract class DataModelORM<Schema = any> {
    abstract constructReferences(cwire: CWire, nativeModels: {
        [key: string]: DataModel;
    }): Promise<any>;
    abstract getName(): Promise<string>;
    abstract create(values: Schema): Promise<any>;
    abstract count(query: DataModelQuery): Promise<any>;
    abstract remove(query: DataModelQuery): Promise<any>;
    abstract findOne(query: DataModelQuery): Promise<any>;
    abstract findAll(query: DataModelQuery): Promise<any>;
    abstract update(query: DataModelQuery, changes: Schema): Promise<any>;
}
