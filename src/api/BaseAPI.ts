import { CWire } from '../CWire';
import { AxiosInstance, AxiosResponse } from 'axios';

/**
 * @property {cwire} CWire
 * @property {AxiosInstance} api
 */
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
