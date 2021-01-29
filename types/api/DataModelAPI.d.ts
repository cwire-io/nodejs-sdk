import { DataModel } from '../DataModel';
import { BaseAPI } from './BaseAPI';
export declare class DataModelAPI extends BaseAPI {
    init(): Promise<any>;
    syncModels(models: DataModel[]): Promise<any>;
    clearAllDataModels(): Promise<any>;
    getAllDataModels(): Promise<import("axios").AxiosResponse<any>>;
}
