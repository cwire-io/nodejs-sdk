import { BaseAPI } from "./BaseAPI";
import { DataModel } from "../DataModel";
export declare class DataModelAPI extends BaseAPI {
    init(): Promise<void>;
    syncModels(models: DataModel[]): Promise<import("axios").AxiosResponse<any>[] | undefined>;
    clearAllDataModels(): Promise<import("axios").AxiosResponse<any>>;
    getAllDataModels(): Promise<import("axios").AxiosResponse<any>>;
}
