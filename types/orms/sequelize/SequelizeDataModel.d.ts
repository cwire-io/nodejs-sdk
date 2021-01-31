import { CWire } from '../../CWire';
import { DataModel } from '../../DataModel';
import { DataModelQuery } from '../../types/DataModelQuery';
export declare type SequelizeModel = any;
export declare const SequelizeType = "Sequelize";
export default class SequelizeDataModel<Schema = any> extends DataModel<Schema> {
    protected model: SequelizeModel;
    constructor(model: SequelizeModel);
    getName(): string;
    getType(): string;
    constructReferences(cwire: CWire, nativeModels: {
        [key: string]: DataModel;
    }): Promise<any>;
    count(cwire: CWire, query: DataModelQuery): Promise<any>;
    create(cwire: CWire, values: any): Promise<any>;
    findAll(cwire: CWire, query: DataModelQuery): Promise<any>;
    getModel(): SequelizeModel;
    findOne(cwire: CWire, query: DataModelQuery): Promise<any>;
    remove(cwire: CWire, query: DataModelQuery): Promise<any>;
    update(cwire: CWire, query: DataModelQuery, changes: any): Promise<any>;
}
