import { BaseAPI } from "./BaseAPI";
import { DataModel } from "../DataModel";

export class DataModelAPI extends BaseAPI {
  async init() {
    await this.clearAllDataModels();
    await this.syncModels(this.cwire.getDataModelsList());
  }

  async syncModels(models: DataModel[]) {
    const responses = [];
    for (const model of models) {
      responses.push(this.api.post('/models', model.toJSON()));
    }
    return Promise.all(responses);
  }

  async clearAllDataModels() {
    return this.api.post("/models/clear");
  }

  async getAllDataModels() {
    return this.api.get("/models");
  }

  /*
  public static parse(data: any | any[]): DataModel | DataModel[] {
    if (Array.isArray(data)) {
      const models: DataModel[] = [];
      for (const model of data) {
        const dataModel = new DataModel(model.name);
        dataModel.changeByObject(data);
        models.push(dataModel);
      }

      return models;
    }

    const model = new DataModel(data.name);
    model.changeByObject(data);
    return model;
  }
  */
}
