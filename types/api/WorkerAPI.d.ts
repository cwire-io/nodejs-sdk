import { APIWorkerInfoType } from '../types/Worker';
import { BaseAPI } from './BaseAPI';
export declare class WorkerAPI extends BaseAPI {
    init(): Promise<void>;
    getWorkerInfo(): Promise<APIWorkerInfoType>;
}
