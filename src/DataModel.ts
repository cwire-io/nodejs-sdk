import { Model as MongooseModel, Document as MongooseDocument } from "mongoose";
import {
  Model as SequelizeModel,
  ModelCtor as SequelizeModelCtor,
} from "sequelize";

import {
  DataModelActionNotFoundError,
  DataModelFieldNotFoundError,
  FeatureIsNotImplementedNow,
  MissingRequiredPropertyError,
  WrongModelDetectedError,
} from "./errors";
import { DataModelField } from "./DataModelField";
import { DataModelAction } from "./DataModelAction";

import { DataModelFieldOptionsType } from "./types/DataModelFields";
import { DataModelActionOptionsType } from "./types/DataModelActions";
import { parseSequelizeDataTypeToCWireDataType } from "./helper/sequelize";

export type SequelizeModelType = SequelizeModelCtor<SequelizeModel>;

export type CustomDataModelType = "Custom";
export type MongooseDataModelType = "Mongoose";
export type SequelizeDataModelType = "Sequelize";
export type DataModelType =
  | CustomDataModelType
  | MongooseDataModelType
  | SequelizeDataModelType;

export type BaseDataModelOptions = {
  isEditable?: boolean;
  isCreatable?: boolean;
  isDeletable?: boolean;
  type: CustomDataModelType | SequelizeDataModelType | MongooseDataModelType;
};
export type DataModelOptions$Custom = BaseDataModelOptions & {
  get: () => any[];
  type: CustomDataModelType;
  onDelete?: (entity: unknown) => void;
  onChange?: (fields: unknown) => boolean;
  onCreate?: (fields: unknown) => boolean;
  fields?: DataModelField[] | { [name: string]: DataModelFieldOptionsType };
  actions?: DataModelAction[] | { [name: string]: DataModelActionOptionsType };
};

export type DataModelOptions$Sequelize = BaseDataModelOptions & {
  model: SequelizeModelType;
  type: SequelizeDataModelType;
};

export type DataModelOptions$Mongoose = BaseDataModelOptions & {
  type: MongooseDataModelType;
  model: MongooseModel<MongooseDocument>;
};

export type DataModelOptions =
  | DataModelOptions$Custom
  | DataModelOptions$Mongoose
  | DataModelOptions$Sequelize;

export type DataModelAPIParameter = {};
export class DataModel {
  private name: string;
  private id: string | null = null;
  private options: DataModelOptions;
  private fields: { [key: string]: DataModelField } = {};
  private actions: { [key: string]: DataModelAction } = {};
  private model:
    | SequelizeModelType
    | MongooseModel<MongooseDocument>
    | null = null;
  private type:
    | MongooseDataModelType
    | SequelizeDataModelType
    | CustomDataModelType = "Custom";

  constructor(name: string, options: DataModelOptions) {
    if (!name || !options.type) {
      throw new MissingRequiredPropertyError();
    }

    this.name = name;
    this.options = options;
    this.type = options.type;

    switch (options.type) {
      case "Custom":
        this.initCustomDataModel(options);
        break;
      case "Mongoose":
        this.initMongooseModel(options);
        break;
      case "Sequelize":
        this.initSequelizeModel(options);
    }
  }

  private initSequelizeModel(options: DataModelOptions$Sequelize) {
    this.model = options.model;

    for (const sequelizeField of Object.values(this.model.rawAttributes)) {
      if (sequelizeField.field) {
        this.fields[sequelizeField.field] = new DataModelField(
          sequelizeField.field,
          {
            type: parseSequelizeDataTypeToCWireDataType(sequelizeField.type),
          }
        );
      }
    }
  }

  private initMongooseModel(options: DataModelOptions$Mongoose) {
    throw new FeatureIsNotImplementedNow();
  }

  private initCustomDataModel(options: DataModelOptions$Custom) {
    if (options.fields) {
      if (Array.isArray(options.fields)) {
        for (const field of options.fields) {
          this.fields[field.getName()] = field;
        }
      } else {
        for (const fieldName of Object.keys(options.fields)) {
          this.fields[fieldName] = new DataModelField(
            fieldName,
            options.fields[fieldName]
          );
        }
      }
    }
    if (options.actions) {
      if (Array.isArray(options.actions)) {
        for (const action of options.actions) {
          this.actions[action.getName()] = action;
        }
      } else {
        for (const actionName of Object.keys(options.actions)) {
          this.actions[actionName] = new DataModelAction(
            actionName,
            options.actions[actionName]
          );
        }
      }
    }
  }

  public changeByObject(obj: DataModelAPIParameter) {}

  public getName(): string {
    return this.name;
  }

  public getId(): string | null {
    return this.id;
  }

  public setId(newId: string): void {
    this.id = newId;
  }

  public getType(): DataModelType {
    return this.type;
  }

  public getSequelizeModel(): SequelizeModelType {
    if (this.model === null || !this.model || this.type !== "Sequelize") {
      throw new WrongModelDetectedError();
    }

    // @ts-ignore
    return this.model;
  }

  public getMongooseModel(): MongooseModel<MongooseDocument> {
    if (this.model === null || !this.model || this.type !== "Mongoose") {
      throw new WrongModelDetectedError();
    }

    // @ts-ignore
    return this.model;
  }

  public getOptions(): DataModelOptions {
    return this.options;
  }

  public toJSON() {
    return {
      id: this.getId(),
      name: this.getName(),
      fields: this.getFieldsList().map((field) => field.toJSON()),
      actions: this.getActionsList().map((action) => action.toJSON()),
    };
  }

  public getActionsMap(): { [name: string]: DataModelAction } {
    return this.actions;
  }

  public getActionsList(): DataModelAction[] {
    return Object.values(this.actions);
  }

  public isActionExist(name: string): boolean {
    return !!this.actions[name];
  }

  public getActionByName(name: string): DataModelAction {
    if (!this.isActionExist(name)) {
      throw new DataModelActionNotFoundError();
    }

    return this.actions[name];
  }

  public getFieldsMap(): { [name: string]: DataModelField } {
    return this.fields;
  }

  public getFieldsList(): DataModelField[] {
    return Object.values(this.fields);
  }

  public isFieldExist(name: string): boolean {
    return !!this.fields[name];
  }

  public getFieldByName(name: string): DataModelField {
    if (!this.isFieldExist(name)) {
      throw new DataModelFieldNotFoundError();
    }

    return this.fields[name];
  }
}
