import { CWire } from './CWire';
import { DataModelField } from './DataModelField';
import { DataModelAction } from './DataModelAction';
import { DataModelQuery } from './types/DataModelQuery';
import {
  DataModelFieldNotFoundError,
  DataModelActionNotFoundError,
  MissingRequiredPropertyError,
} from './errors';
import Logger from './helper/logger';
import { APIDataModel } from './types/DataModel';
import { DATA_MODEL_ENTITY_EVENT_LOGGER_PREFIX } from './constants/logger';

export type SequelizeModelType = any;

export type DataModelOptions = Partial<{
  isEditable: boolean;
  isCreatable: boolean;
  isDeletable: boolean;
  useEntityHistory: boolean;
}>;

export const defaultOptions: DataModelOptions = {
  isEditable: true,
  isDeletable: true,
  isCreatable: true,
  useEntityHistory: false,
};

/**
 * @property {string} name
 * @property {DataModelOptions} options
 */
export abstract class DataModel<Schema = any> {
  protected name: string;
  // Typescript does not check that this variable is created by the init functions
  // @ts-ignore
  protected primaryKey: string;
  protected id: string | null = null;
  protected options: DataModelOptions;
  protected references: {
    [modelName: string]: { field: string; referenceField: string };
  } = {};
  protected fields: { [key: string]: DataModelField } = {};
  protected actions: { [key: string]: DataModelAction } = {};

  public abstract async constructReferences(
    cwire: CWire,
    nativeModels: { [key: string]: DataModel },
  ): Promise<any>;
  public abstract getName(): string;
  public abstract getType(): string;

  public abstract async create(cwire: CWire, values: Schema): Promise<any>;
  public abstract async count(
    cwire: CWire,
    query: DataModelQuery,
  ): Promise<any>;
  public abstract async remove(
    cwire: CWire,
    query: DataModelQuery,
  ): Promise<any>;
  public abstract async findOne(
    cwire: CWire,
    query: DataModelQuery,
  ): Promise<any>;
  public abstract async findAll(
    cwire: CWire,
    query: DataModelQuery,
  ): Promise<any>;
  public abstract async update(
    cwire: CWire,
    query: DataModelQuery,
    changes: Schema,
  ): Promise<any>;

  constructor(name: string, options: DataModelOptions) {
    if (!name) {
      throw new MissingRequiredPropertyError();
    }

    this.name = name;
    this.options = options;
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
      isEditable: this.getOptions().isEditable,
      isCreatable: this.getOptions().isCreatable,
      isDeletable: this.getOptions().isDeletable,
      fields: this.getFieldsList().map((field) => field.toJSON()),
      actions: this.getActionsList().map((action) => action.toJSON()),
    };
  }

  public getModelReferenceField(model: DataModel) {
    /*
    for (const field of this.getFieldsList()) {
      if (field.getReference()) {
        if (field.getReference()?.model === model.getName()) {
        }
      }
    }
     */
  }

  public sync(model: APIDataModel) {
    for (const reference of model.references) {
      this.references[reference.model] = {
        field: reference.field,
        referenceField: reference.modelField,
      };
    }
  }

  public getReferences() {
    return this.references;
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

  public async dispatch(
    entityId: string,
    type: string,
    options: Partial<{
      after: any;
      before: any;
      icon: string;
      color: string;
      description: string;
    }> = {},
  ) {
    return this.addEntityEvent(entityId, type, options);
  }

  public async addEntityEvent(
    entityId: string,
    type: string,
    options: Partial<{
      after: any;
      before: any;
      icon: string;
      color: string;
      description: string;
    }> = {},
  ) {
    try {
      await CWire.getInstance()
        .getAPI()
        .getDataModelAPI()
        .addEvent(type, entityId, this.getName(), options);
      Logger.system(
        DATA_MODEL_ENTITY_EVENT_LOGGER_PREFIX,
        `Log ${type} of ${entityId}`,
      );
    } catch (error) {
      Logger.error(
        DATA_MODEL_ENTITY_EVENT_LOGGER_PREFIX,
        `Error by logging ${error.toString()}`,
      );
    }
  }
}
