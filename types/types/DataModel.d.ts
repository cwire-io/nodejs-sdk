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
