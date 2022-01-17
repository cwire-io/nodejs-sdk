import { APIDataModelField } from './DataModelFields';
export declare type DataModelReference = {
    field: string;
    model: string;
    modelField: string;
};
export declare type APIDataModel = {
    name: string;
    companyId: string;
    primaryKey: string;
    isEditable: boolean;
    isCreatable: boolean;
    route: string | null;
    isWorkerModel: boolean;
    fields: APIDataModelField[];
    references: DataModelReference[];
};
export declare type APIEntityEvent = {
    icon: string;
    type: string;
    color: string;
    entityId: string;
    modelName: string;
    description: string;
    after: Record<any, any> | null;
    before: Record<any, any> | null;
};
export declare type EntityEventOptions = {
    icon: string;
    color: string;
    description: string;
    after: Record<any, any> | null;
    before: Record<any, any> | null;
};
