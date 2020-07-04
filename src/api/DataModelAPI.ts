import {BaseAPI} from "./BaseAPI";

export class DataModelAPI extends BaseAPI {
  async getAllDataModels() {
    return this.api.get('/models');
  }
}
