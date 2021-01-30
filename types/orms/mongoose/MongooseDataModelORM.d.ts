import { Document as MongooseDocument, Model as MongooseModel } from 'mongoose';
import { CWire } from '../../CWire';
import { DataModelORM } from '../../DataModelORM';
import { DataModelQuery } from '../../types/DataModelQuery';
import MongooseDataModel from './MongooseDataModel';
import { DataModel } from '../../DataModel';
export declare class MongooseDataModelORM extends DataModelORM {
    model: MongooseModel<MongooseDocument>;
    dataModel: MongooseDataModel;
    constructor(model: MongooseModel<MongooseDocument>, dataModel: MongooseDataModel);
    constructReferences(cwire: CWire, nativeModels: {
        [key: string]: DataModel;
    }): Promise<any>;
    create(values: any): Promise<any>;
    count(query: DataModelQuery): Promise<any>;
    findAll(query: DataModelQuery): Promise<any>;
    findOne(query: DataModelQuery): Promise<any>;
    remove(query: DataModelQuery): Promise<any>;
    update(query: DataModelQuery, changes: any): Promise<any>;
    getName(): Promise<string>;
}
