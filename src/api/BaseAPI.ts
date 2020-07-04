import { AxiosInstance } from 'axios';

export class BaseAPI {
  protected readonly api: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.api = axios;
  }

}
