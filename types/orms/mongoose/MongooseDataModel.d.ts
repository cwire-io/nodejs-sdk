import { Model as MongooseModel, Document as MongooseDocument } from 'mongoose';
import { CWire } from '../../CWire';
import { DataModelQuery } from '../../types/DataModelQuery';
import { DataModelCalculationFunctions } from '../../types/DataModel';
import { DataModel, DataModelOptions } from '../../DataModel';
export declare const MongooseType = "Mongoose";
export declare type MongooseDataModelOptions = Partial<{} & DataModelOptions>;
export default class MongooseDataModel<Schema = any> extends DataModel<Schema> {
    protected model: MongooseModel<MongooseDocument>;
    constructor(model: MongooseModel<MongooseDocument>, options?: MongooseDataModelOptions);
    getName(): string;
    getType(): string;
    constructReferences(cwire: CWire, nativeModels: {
        [key: string]: DataModel;
    }): Promise<any>;
    create(cwire: CWire, values: any): Promise<any>;
    count(cwire: CWire, query: DataModelQuery): Promise<any>;
    findAll(cwire: CWire, query: DataModelQuery): Promise<any>;
    findOne(cwire: CWire, query: DataModelQuery): Promise<any>;
    remove(cwire: CWire, query: DataModelQuery): Promise<any>;
    update(cwire: CWire, query: DataModelQuery, changes: any): Promise<any>;
    calculate(cwire: CWire, calcFn: DataModelCalculationFunctions, fieldName: string, query: DataModelQuery): Promise<any>;
}
