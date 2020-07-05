import { BaseAPI } from "./BaseAPI";
import {Axios} from "axios";

export class DataModelAPI extends BaseAPI {
  constructor(api: Axios) {
    console.log(api.create());
    super(api)
  }

  async getAllDataModels() {
    return this.api.get("/models");
  }
}
