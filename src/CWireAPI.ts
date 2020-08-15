import { CWire } from "./CWire";
import { AxiosInstance } from "axios";

import { TunnelAPI } from "./api/TunnelAPI";
import { DataModelAPI } from "./api/DataModelAPI";

export class CWireAPI {
  private cwire: CWire;
  private readonly tunnelAPI: TunnelAPI;
  private readonly dataModelAPI: DataModelAPI;
  private readonly api: AxiosInstance;

  constructor(cwire: CWire, axios: AxiosInstance) {
    this.api = axios;
    this.cwire = cwire;
    this.tunnelAPI = new TunnelAPI(cwire, axios);
    this.dataModelAPI = new DataModelAPI(cwire, axios);
  }

  public async init() {
    await this.dataModelAPI.init();
  }

  public getAxios(): AxiosInstance {
    return this.api;
  }

  public getDataModelAPI() {
    this.getDataModelAPI();
  }

  public getTunnelAPI() {
    return this.tunnelAPI;
  }

}
