import { DataModelField } from "./DataModelField";
import { DataModelAction } from "./DataModelAction";
import { DataModelFieldOptionsType } from "./types/DataModelFields";
import { DataModelActionOptionsType } from "./types/DataModelActions";
export interface DataModelOptions {
    get: () => any[];
    isEditable?: boolean;
    isCreatable?: boolean;
    isDeletable?: boolean;
    onDelete?: (entity: unknown) => void;
    onChange?: (fields: unknown) => boolean;
    onCreate?: (fields: unknown) => boolean;
    fields?: DataModelField[] | {
        [name: string]: DataModelFieldOptionsType;
    };
    actions?: DataModelAction[] | {
        [name: string]: DataModelActionOptionsType;
    };
}
export declare type DataModelAPIParameter = {};
export declare class DataModel {
    private name;
    private id;
    private options;
    private fields;
    private actions;
    constructor(name: string, options: DataModelOptions);
    changeByObject(obj: DataModelAPIParameter): void;
    getName(): string;
    getId(): string | null;
    setId(newId: string): void;
    getOptions(): DataModelOptions;
    toJSON(): {
        id: string | null;
        name: string;
        fields: {
            name: string;
            type: import("./types/DataModelFields").DataModelFieldType;
        }[];
        actions: {
            name: string;
            type: import("./types/DataModelActions").DataModelActionType;
        }[];
    };
    getActionsMap(): {
        [name: string]: DataModelAction;
    };
    getActionsList(): DataModelAction[];
    isActionExist(name: string): boolean;
    getActionByName(name: string): DataModelAction;
    getFieldsMap(): {
        [name: string]: DataModelField;
    };
    getFieldsList(): DataModelField[];
    isFieldExist(name: string): boolean;
    getFieldByName(name: string): DataModelField;
}
