import { CWire } from '../CWire';
import { AxiosInstance, AxiosResponse } from 'axios';

export const API_LOGGER_PREFIX = 'API';

export class BaseAPI {
  cwire: CWire;
  api: AxiosInstance;

  constructor(cwire: CWire, api: AxiosInstance) {
    this.api = api;
    this.cwire = cwire;
  }

  public static getServiceData(res: AxiosResponse) {
    return res.data.data;
  }
}
