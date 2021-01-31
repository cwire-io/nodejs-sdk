import { Document as MongooseDocument, Model as MongooseModel } from 'mongoose';
import { DataModelORM } from '../../DataModelORM';
import MongooseDataModel from './MongooseDataModel';
export declare class MongooseDataModelORM extends DataModelORM {
    model: MongooseModel<MongooseDocument>;
    dataModel: MongooseDataModel;
    constructor(model: MongooseModel<MongooseDocument>, dataModel: MongooseDataModel);
}
