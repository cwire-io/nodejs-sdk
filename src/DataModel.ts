import { Model as MongooseModel, Document as MongooseDocument } from 'mongoose';

import {
  DataModelFieldNotFoundError,
  DataModelActionNotFoundError,
  MissingRequiredPropertyError,
} from './errors';
import { DataModelORM } from './DataModelORM';
import { DataModelField } from './DataModelField';
import { DataModelAction } from './DataModelAction';

export type SequelizeModelType = any;

export type DataModelOptions = {};

export class DataModel {
  protected name: string;
  protected orm: DataModelORM | null = null;
  // Typescript does not check that this variable is created by the init functions
  // @ts-ignore
  protected primaryKey: string;
  protected id: string | null = null;
  protected options: DataModelOptions;
  protected fields: { [key: string]: DataModelField } = {};
  protected actions: { [key: string]: DataModelAction } = {};
  protected model:
    | SequelizeModelType
    | MongooseModel<MongooseDocument>
    | null = null;

  public static DATA_MODEL_TYPES = {
    CUSTOM: 'Custom',
    MONGOOSE: 'Mongoose',
    SEQUELIZE: 'Sequelize',
  };

  constructor(name: string, options: DataModelOptions) {
    if (!name) {
      throw new MissingRequiredPropertyError();
    }

    this.name = name;
    this.options = options;
  }

  getORM(): DataModelORM {
    if (!this.orm) {
      // TODO: Implement custom error message
      throw new Error();
    }

    return this.orm;
  }

  public getName(): string {
    return this.name;
  }

  public getPrimaryKey(): string {
    return this.primaryKey;
  }

  public getId(): string | null {
    return this.id;
  }

  public setId(newId: string): void {
    this.id = newId;
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

  public addAction(action: DataModelAction) {
    this.actions[action.getName()] = action;
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

  public addField(field: DataModelField) {
    this.fields[field.getName()] = field;
  }
}
