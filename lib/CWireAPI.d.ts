import { CWire } from "./CWire";
import { AxiosInstance } from "axios";
import { TunnelAPI } from "./api/TunnelAPI";
export declare class CWireAPI {
    private cwire;
    private readonly tunnelAPI;
    private readonly dataModelAPI;
    private readonly api;
    constructor(cwire: CWire, axios: AxiosInstance);
    init(): Promise<void>;
    getAxios(): AxiosInstance;
    getDataModelAPI(): void;
    getTunnelAPI(): TunnelAPI;
}
