import { DataModel } from '../DataModel';
import { APIDataModel } from '../types/DataModel';
import { BaseAPI } from './BaseAPI';
export declare type DATA_MODEL_ENTITY_EVENTS = 'CREATED' | 'UPDATED' | 'DELETED' | 'DISPATCHED' | string;
export declare class DataModelAPI extends BaseAPI {
    init(): Promise<any>;
    syncModels(models: DataModel[]): Promise<any>;
    getDataModelByName(name: string): Promise<APIDataModel>;
    addEvent(event: DATA_MODEL_ENTITY_EVENTS, entityId: string, model: DataModel, { description, before, after, }?: Partial<{
        description: string;
        before: any;
        after: any;
    }>): Promise<any>;
}
