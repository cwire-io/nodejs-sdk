import { CWire } from './CWire';
import { DataModelField } from './DataModelField';
import { DataModelAction } from './DataModelAction';
import { DataModelQuery } from './types/DataModelQuery';
import { APIDataModel, DataModelCalculationFunctions } from './types/DataModel';
export declare type SequelizeModelType = any;
export declare type DataModelOptions = Partial<{
    isEditable: boolean;
    isCreatable: boolean;
    isDeletable: boolean;
    useEntityHistory: boolean;
}>;
export declare const defaultOptions: DataModelOptions;
export declare abstract class DataModel<Schema = any> {
    protected name: string;
    protected primaryKey: string;
    protected id: string | null;
    protected options: DataModelOptions;
    protected references: {
        [modelName: string]: {
            field: string;
            referenceField: string;
        };
    };
    protected fields: {
        [key: string]: DataModelField;
    };
    protected actions: {
        [key: string]: DataModelAction;
    };
    abstract constructReferences(cwire: CWire, nativeModels: {
        [key: string]: DataModel;
    }): Promise<any>;
    abstract getName(): string;
    abstract getType(): string;
    abstract create(cwire: CWire, values: Schema): Promise<any>;
    abstract count(cwire: CWire, query: DataModelQuery): Promise<any>;
    abstract remove(cwire: CWire, query: DataModelQuery): Promise<any>;
    abstract findOne(cwire: CWire, query: DataModelQuery): Promise<any>;
    abstract findAll(cwire: CWire, query: DataModelQuery): Promise<any>;
    abstract update(cwire: CWire, query: DataModelQuery, changes: Schema): Promise<any>;
    abstract calculate(cwire: CWire, calcFn: DataModelCalculationFunctions, fieldName: string, query: DataModelQuery): Promise<any>;
    constructor(name: string, options: DataModelOptions);
    getPrimaryKey(): string;
    getId(): string | null;
    setId(newId: string): void;
    getOptions(): DataModelOptions;
    toJSON(): {
        id: string | null;
        name: string;
        isEditable: boolean | undefined;
        isCreatable: boolean | undefined;
        isDeletable: boolean | undefined;
        fields: {
            displayName?: string;
            name: string;
            type: import(".").DataModelFieldType;
            reference: {
                type: "one" | "many";
                model: string;
                field: string;
            } | null;
            isPrimary: boolean;
        }[];
        actions: {
            name: string;
            type: import("./types/DataModelAction").DataModelActionType;
        }[];
    };
    getModelReferenceField(model: DataModel): void;
    sync(model: APIDataModel): void;
    getReferences(): {
        [modelName: string]: {
            field: string;
            referenceField: string;
        };
    };
    getActionsMap(): {
        [name: string]: DataModelAction;
    };
    getActionsList(): DataModelAction[];
    isActionExist(name: string): boolean;
    getActionByName(name: string): DataModelAction;
    addAction(action: DataModelAction): void;
    getFieldsMap(): {
        [name: string]: DataModelField;
    };
    getFieldsList(): DataModelField[];
    isFieldExist(name: string): boolean;
    getFieldByName(name: string): DataModelField;
    addField(field: DataModelField): void;
    dispatch(entityId: string, type: string, options?: Partial<{
        after: any;
        before: any;
        icon: string;
        color: string;
        description: string;
    }>): Promise<void>;
    addEntityEvent(entityId: string, type: string, options?: Partial<{
        after: any;
        before: any;
        icon: string;
        color: string;
        description: string;
    }>): Promise<void>;
}
