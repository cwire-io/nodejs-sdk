import { CWire } from './CWire';
import { AxiosInstance } from 'axios';
import { DataModelAPI } from './api/DataModelAPI';
export declare class CWireAPI {
    private cwire;
    private readonly api;
    private readonly workerAPI;
    private readonly dataModelAPI;
    constructor(cwire: CWire, axios: AxiosInstance);
    init(): Promise<void>;
    getAxios(): AxiosInstance;
    getDataModelAPI(): DataModelAPI;
}
