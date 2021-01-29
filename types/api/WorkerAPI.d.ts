import { BaseAPI } from './BaseAPI';
import { APIWorkerInfoType } from '../types/Worker';
export declare class WorkerAPI extends BaseAPI {
    init(): Promise<void>;
    getWorkerInfo(): Promise<APIWorkerInfoType>;
}
