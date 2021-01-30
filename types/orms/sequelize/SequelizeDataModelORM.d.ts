import { CWire } from '../../CWire';
import { DataModel } from '../../DataModel';
import { DataModelORM } from '../../DataModelORM';
import { DataModelQuery } from '../../types/DataModelQuery';
import SequelizeDataModel, { SequelizeModel } from './SequelizeDataModel';
export default class SequelizeDataModelORM extends DataModelORM {
    model: SequelizeModel;
    dataModel: SequelizeDataModel;
    constructor(model: SequelizeModel, dataModel: SequelizeDataModel);
    constructReferences(cwire: CWire, nativeModels: {
        [key: string]: DataModel;
    }): Promise<any>;
    count(query: DataModelQuery): Promise<any>;
    create(values: any): Promise<any>;
    findAll(query: DataModelQuery): Promise<any>;
    findOne(query: DataModelQuery): Promise<any>;
    remove(query: DataModelQuery): Promise<any>;
    update(query: DataModelQuery, changes: any): Promise<any>;
    getName(): Promise<string>;
}
