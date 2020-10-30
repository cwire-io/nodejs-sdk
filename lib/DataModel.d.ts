import { Model as MongooseModel, Document as MongooseDocument } from "mongoose";
import { Model as SequelizeModel, ModelCtor as SequelizeModelCtor } from "sequelize";
import { DataModelField } from "./DataModelField";
import { DataModelAction } from "./DataModelAction";
import { DataModelFieldOptionsType } from "./types/DataModelFields";
import { DataModelActionOptionsType } from "./types/DataModelActions";
export declare type SequelizeModelType = SequelizeModelCtor<SequelizeModel>;
export declare type CustomDataModelType = "Custom";
export declare type MongooseDataModelType = "Mongoose";
export declare type SequelizeDataModelType = "Sequelize";
export declare type DataModelType = CustomDataModelType | MongooseDataModelType | SequelizeDataModelType;
export declare type BaseDataModelOptions = {
    isEditable?: boolean;
    isCreatable?: boolean;
    isDeletable?: boolean;
    type: CustomDataModelType | SequelizeDataModelType | MongooseDataModelType;
};
export declare type DataModelOptions$Custom = BaseDataModelOptions & {
    get: () => any[];
    type: CustomDataModelType;
    onDelete?: (entity: unknown) => void;
    onChange?: (fields: unknown) => boolean;
    onCreate?: (fields: unknown) => boolean;
    fields?: DataModelField[] | {
        [name: string]: DataModelFieldOptionsType;
    };
    actions?: DataModelAction[] | {
        [name: string]: DataModelActionOptionsType;
    };
};
export declare type DataModelOptions$Sequelize = BaseDataModelOptions & {
    model: SequelizeModelType;
    type: SequelizeDataModelType;
};
export declare type DataModelOptions$Mongoose = BaseDataModelOptions & {
    type: MongooseDataModelType;
    model: MongooseModel<MongooseDocument>;
};
export declare type DataModelOptions = DataModelOptions$Custom | DataModelOptions$Mongoose | DataModelOptions$Sequelize;
export declare type DataModelAPIParameter = {};
export declare class DataModel {
    private name;
    private primaryKey;
    private id;
    private options;
    private fields;
    private actions;
    private model;
    private type;
    constructor(name: string, options: DataModelOptions);
    private initSequelizeModel;
    private initMongooseModel;
    private initCustomDataModel;
    getName(): string;
    getPrimaryKey(): string;
    getId(): string | null;
    setId(newId: string): void;
    getType(): DataModelType;
    getSequelizeModel(): SequelizeModelType;
    getMongooseModel(): MongooseModel<MongooseDocument>;
    getOptions(): DataModelOptions;
    toJSON(): {
        id: string | null;
        name: string;
        fields: {
            name: string;
            type: import("./types/DataModelFields").DataModelFieldType;
            isPrimary: boolean;
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
