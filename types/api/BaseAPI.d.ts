import { CWire } from "../CWire";
import { AxiosInstance, AxiosResponse } from "axios";
export declare class BaseAPI {
    cwire: CWire;
    api: AxiosInstance;
    constructor(cwire: CWire, api: AxiosInstance);
    static getServiceData(res: AxiosResponse): any;
}
