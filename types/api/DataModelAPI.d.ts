import { DataModel } from '../DataModel';
import { APIDataModel } from '../types/DataModel';
import { BaseAPI } from './BaseAPI';
export declare class DataModelAPI extends BaseAPI {
    init(): Promise<any>;
    syncModels(models: DataModel[]): Promise<any>;
    clearAllDataModels(): Promise<any>;
    getDataModelByName(name: string): Promise<APIDataModel>;
}
