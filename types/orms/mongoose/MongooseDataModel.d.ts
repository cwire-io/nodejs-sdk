import { Model as MongooseModel, Document as MongooseDocument } from 'mongoose';
import { CWire } from '../../CWire';
import { DataModel } from '../../DataModel';
import { DataModelQuery } from '../../types/DataModelQuery';
export declare const MongooseType = "Mongoose";
export default class MongooseDataModel<Schema = any> extends DataModel<Schema> {
    protected model: MongooseModel<MongooseDocument>;
    constructor(model: MongooseModel<MongooseDocument>);
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
}
