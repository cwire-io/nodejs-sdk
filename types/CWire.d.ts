import { CWireAPI } from './CWireAPI';
import { DataModel } from './DataModel';
import { TextFieldType, NumberFieldType, CustomFieldType, BooleanFieldType, DateFieldType, DateTimeFieldType, TimestampFieldType, EmailFieldType, PasswordFieldType, DescriptionFieldType, MongoDBObjectIdFieldType } from './types/DataModelFields';
import { APIWorkerInfoType } from './types/Worker';
import Logger, { LogLevel } from './helper/logger';
import { WorkerFunctions } from './worker/functions';
interface CWireOptions {
    route?: string;
    apiURL?: string;
    logger?: LogLevel;
    models?: DataModel[];
}
export declare class CWire {
    private logger;
    private static instance;
    static FIELD_TYPES: {
        TEXT: TextFieldType;
        NUMBER: NumberFieldType;
        CUSTOM: CustomFieldType;
        BOOLEAN: BooleanFieldType;
        OBJECTID: MongoDBObjectIdFieldType;
        EMAIL: EmailFieldType;
        PASSWORD: PasswordFieldType;
        DESCRIPTION: DescriptionFieldType;
        DATE: DateFieldType;
        DATETIME: DateTimeFieldType;
        TIMESTAMP: TimestampFieldType;
    };
    private api;
    private apiKey;
    private websocket;
    private worker?;
    private workerFunctions;
    private models;
    private cwireRoute;
    private cwireAPIURL;
    constructor(apiKey: string, options?: CWireOptions);
    static init(apiKey: string, options?: CWireOptions): Promise<CWire>;
    private constructReferences;
    getAPIURL(): string;
    getAPIKey(): string;
    getAPI(): CWireAPI;
    getWorker(): APIWorkerInfoType | undefined;
    setWorker(worker: APIWorkerInfoType): void;
    getWorkerFunctions(): WorkerFunctions;
    getAxios(): import("axios").AxiosInstance;
    getDataModelsMap(): {
        [name: string]: DataModel<any>;
    };
    getDataModelsList(): DataModel<any>[];
    isDataModelExists(name: string): boolean;
    getLogger(): Logger;
    static getInstance(): CWire;
    getDataModelByName(name: string): DataModel<any>;
}
export {};
