import { Model as MongooseModel, Document as MongooseDocument } from 'mongoose';
import { DataModelORM } from './DataModelORM';
import { DataModelField } from './DataModelField';
import { DataModelAction } from './DataModelAction';
export declare type SequelizeModelType = any;
export declare type DataModelOptions = {};
export declare class DataModel {
    protected name: string;
    protected orm: DataModelORM | null;
    protected primaryKey: string;
    protected id: string | null;
    protected options: DataModelOptions;
    protected fields: {
        [key: string]: DataModelField;
    };
    protected actions: {
        [key: string]: DataModelAction;
    };
    protected model: SequelizeModelType | MongooseModel<MongooseDocument> | null;
    static DATA_MODEL_TYPES: {
        CUSTOM: string;
        MONGOOSE: string;
        SEQUELIZE: string;
    };
    constructor(name: string, options: DataModelOptions);
    getORM(): DataModelORM;
    getName(): string;
    getPrimaryKey(): string;
    getId(): string | null;
    setId(newId: string): void;
    getOptions(): DataModelOptions;
    toJSON(): {
        id: string | null;
        name: string;
        fields: {
            name: string;
            type: import(".").DataModelFieldType;
            reference: {
                model: string;
                field: string;
            } | null;
            isPrimary: boolean;
        }[];
        actions: {
            name: string;
            type: import(".").DataModelActionType;
        }[];
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
}
