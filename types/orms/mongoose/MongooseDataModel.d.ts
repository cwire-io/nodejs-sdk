import { Model as MongooseModel, Document as MongooseDocument } from 'mongoose';
import { DataModel } from '../../DataModel';
export default class MongooseDataModel extends DataModel {
    constructor(model: MongooseModel<MongooseDocument>);
}
