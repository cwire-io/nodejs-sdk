import { AxiosInstance } from "axios";
import { DataModelAPI } from "./api/DataModelAPI";

export class CWireAPI {
  private dataModelAPI: DataModelAPI;
  private readonly api: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.api = axios;
    this.dataModelAPI = new DataModelAPI(this.api);
  }

  public getAxios(): AxiosInstance {
    return this.api;
  }
}
