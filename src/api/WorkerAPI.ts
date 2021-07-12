import { WorkerNotFound } from '../errors';
import { parseResponse } from '../helper/api';
import { APIWorkerInfoType } from '../types/Worker';
import { API_LOGGER_PREFIX } from '../constants/logger';

import { BaseAPI } from './BaseAPI';

/**
 * @memberOf BaseAPI
 */
export class WorkerAPI extends BaseAPI {
  async init() {
    try {
      this.cwire.setWorker(await this.getWorkerInfo());
      this.cwire
        .getLogger()
        .system(API_LOGGER_PREFIX, 'Fetched worker information successfully.');
    } catch (error) {
      this.cwire
        .getLogger()
        .error(
          API_LOGGER_PREFIX,
          `Worker api init failed with ${error.toString()}`,
        );
    }
  }

  async getWorkerInfo(): Promise<APIWorkerInfoType> {
    try {
      return parseResponse<APIWorkerInfoType>(
        await this.api.get('/auth/api-clients/me'),
      );
    } catch (err) {
      throw new WorkerNotFound();
    }
  }
}
