import { BaseAPI } from "./BaseAPI";
import { WorkerNotFound } from "../errors";
import { parseResponse } from "../helper/api";
import { APIWorkerInfoType } from "../types/Worker";

export class WorkerAPI extends BaseAPI {
  async init() {
    this.cwire.setWorker(await this.getWorkerInfo());
  }

  async getWorkerInfo(): Promise<APIWorkerInfoType> {
    try {
      return parseResponse<APIWorkerInfoType>(
        await this.api.get("/auth/api-clients/me")
      );
    } catch (err) {
      throw new WorkerNotFound();
    }
  }
}
