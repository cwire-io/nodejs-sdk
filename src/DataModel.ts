import { DataModelField, DataModelFieldOptions } from "./DataModelField";
import { DataModelAction, DataModelActionOptions } from "./DataModelAction";

export interface DataModelOptions {
  fields?: DataModelField[] | { [name: string]: DataModelFieldOptions };
  actions?: DataModelAction[] | { [name: string]: DataModelActionOptions };
}

export class DataModel {
  private name: string;
  private fields: { [key: string]: DataModelField } = {};
  private actions: { [key: string]: DataModelAction } = {};

  constructor(name: string, options: DataModelOptions) {
    this.name = name;

    if (options.fields) {
      if (Array.isArray(options.fields)) {
        for (const field of options.fields) {
          this.fields[field.getName()] = field;
        }
      } else {
        for (const fieldName of Object.keys(options.fields)) {
          this.fields[fieldName] = new DataModelField(fieldName);
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
          this.actions[actionName] = new DataModelAction(actionName);
        }
      }
    }
  }

  getName(): string {
    return name;
  }
}
