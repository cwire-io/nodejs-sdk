import { APIInterface, StaticAPIInterface } from "./api/APIInterface";
import { DataModelField, DataModelFieldOptions } from "./DataModelField";
import { DataModelAction, DataModelActionOptions } from "./DataModelAction";

export interface DataModelOptions {
  fields?: DataModelField[] | { [name: string]: DataModelFieldOptions };
  actions?: DataModelAction[] | { [name: string]: DataModelActionOptions };
}

export type DataModelAPIParameter = {};
class BaseDataModel implements APIInterface<DataModelAPIParameter> {
  private name: string;
  private id: string | null = null;
  private fields: { [key: string]: DataModelField } = {};
  private actions: { [key: string]: DataModelAction } = {};

  constructor(name: string, options: DataModelOptions = {}) {
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

  public getName(): string {
    return name;
  }

  public changeByObject(obj: DataModelAPIParameter) {}
  public static parse(data: any | any[]): BaseDataModel | BaseDataModel[] {
    if (Array.isArray(data)) {
      const models: BaseDataModel[] = [];
      for (const model of data) {
        const dataModel = new BaseDataModel(model.name);
        dataModel.changeByObject(data);
        models.push(dataModel);
      }

      return models;
    }

    const model = new BaseDataModel(data.name);
    model.changeByObject(data);
    return model;
  }
}
export type DataModel = StaticAPIInterface<BaseDataModel>;
export const DataModel: StaticAPIInterface<BaseDataModel> = BaseDataModel;
