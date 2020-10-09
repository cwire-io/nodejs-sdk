import { CWireAPI } from "./CWireAPI";
import { DataModel } from "./DataModel";
import { AlertActionType, ButtonActionType, ToggleActionType } from "./types/DataModelActions";
import { BooleanFieldType, CustomFieldType, DescriptionFieldType, EmailFieldType, NumberFieldType, PasswordFieldType, TextFieldType } from "./types/DataModelFields";
import { WorkerFunctions } from "./worker/functions";
import { APIWorkerInfoType } from "./types/Worker";
interface CWireOptions {
    route?: string;
    apiURL?: string;
    models?: DataModel[];
}
export declare class CWire {
    private static instance;
    static FIELD_TYPES: {
        TEXT: TextFieldType;
        EMAIL: EmailFieldType;
        NUMBER: NumberFieldType;
        CUSTOM: CustomFieldType;
        BOOLEAN: BooleanFieldType;
        PASSWORD: PasswordFieldType;
        DESCRIPTION: DescriptionFieldType;
    };
    static ACTIONS: {
        ALERT: AlertActionType;
        TOGGLE: ToggleActionType;
        BUTTON: ButtonActionType;
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
    getAPIURL(): string;
    getAPIKey(): string;
    getAPI(): CWireAPI;
    getWorker(): APIWorkerInfoType | undefined;
    setWorker(worker: APIWorkerInfoType): void;
    getWorkerFunctions(): WorkerFunctions;
    getAxios(): import("axios").AxiosInstance;
    getDataModelsMap(): {
        [name: string]: DataModel;
    };
    getDataModelsList(): DataModel[];
    isDataModelExists(name: string): boolean;
    getDataModelByName(name: string): DataModel;
}
export {};
