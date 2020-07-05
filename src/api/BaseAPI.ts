import { AxiosInstance } from "axios";

export class BaseAPI {
  protected readonly api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }
}
