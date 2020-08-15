import {
  DataModelActionNotFoundError,
  DataModelFieldNotFoundError,
  MissingRequiredPropertyError,
} from "./errors";
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
  fields?: DataModelField[] | { [name: string]: DataModelFieldOptionsType };
  actions?: DataModelAction[] | { [name: string]: DataModelActionOptionsType };
}

export type DataModelAPIParameter = {};
export class DataModel {
  private name: string;
  private id: string | null = null;
  private options: DataModelOptions;
  private fields: { [key: string]: DataModelField } = {};
  private actions: { [key: string]: DataModelAction } = {};

  constructor(name: string, options: DataModelOptions) {
    if (!name) {
      throw new MissingRequiredPropertyError();
    }
    this.name = name;
    this.options = options;

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

  public getOptions(): DataModelOptions {
    return this.options;
  }

  public toJSON() {
    return {
      id: this.getId(),
      name: this.getName(),
      fields: this.getFieldsList().map(field => field.toJSON()),
      actions: this.getActionsList().map(action => action.toJSON()),
    }
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
