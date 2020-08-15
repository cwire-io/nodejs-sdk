import { BaseAPI } from "./BaseAPI";

export class TunnelAPI extends BaseAPI {
  public async createTunnel() {
    return BaseAPI.getServiceData(await this.api.post('/tunnels'));
  }
}
