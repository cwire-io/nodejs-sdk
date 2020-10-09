import { CWire } from "./CWire";
import { AxiosInstance } from "axios";

import { WorkerAPI } from "./api/WorkerAPI";
import { DataModelAPI } from "./api/DataModelAPI";

export class CWireAPI {
  private cwire: CWire;
  private readonly api: AxiosInstance;
  private readonly workerAPI: WorkerAPI;
  private readonly dataModelAPI: DataModelAPI;

  constructor(cwire: CWire, axios: AxiosInstance) {
    this.api = axios;
    this.cwire = cwire;
    this.workerAPI = new WorkerAPI(cwire, axios);
    this.dataModelAPI = new DataModelAPI(cwire, axios);
  }

  public async init() {
    await this.workerAPI.init();
    await this.dataModelAPI.init();
  }

  public getAxios(): AxiosInstance {
    return this.api;
  }

  public getDataModelAPI() {
    this.getDataModelAPI();
  }
}
