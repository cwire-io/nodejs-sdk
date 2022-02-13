import Logger from '../helper/logger';
import { DataModel } from '../DataModel';
import { parseResponse } from '../helper/api';
import { API_LOGGER_PREFIX } from '../constants/logger';
import { APIDataModel, EntityEventOptions } from '../types/DataModel';

import { BaseAPI } from './BaseAPI';

export type DATA_MODEL_ENTITY_EVENTS =
  | 'CREATED'
  | 'UPDATED'
  | 'DELETED'
  | 'DISPATCHED'
  | string;

/**
 * @memberOf BaseAPI
 *
 */
export class DataModelAPI extends BaseAPI {
  async init() {
    try {
      Logger.system(API_LOGGER_PREFIX, 'Initialising worker data models.');
      await this.syncModels(this.cwire.getDataModelsList());
      Logger.system(
        API_LOGGER_PREFIX,
        'Successfully initialising worker data models.',
      );
    } catch (error) {
      Logger.error(
        API_LOGGER_PREFIX,
        `Failed to initialise worker data models with the error: ${error.toString()}`,
      );
      return error;
    }
  }

  async syncModels(models: DataModel[]) {
    const worker = this.cwire.getWorker();
    if (!worker) {
      return;
    }
    const responses = [];

    for (const model of models) {
      responses.push(
        (async () => {
          try {
            Logger.system(
              API_LOGGER_PREFIX,
              `Start syncing ${model.getName()} model: ${JSON.stringify({
                ...model.toJSON(),
                worker: worker.id,
              })}`,
            );
            const response = this.api.post('/models/', {
              ...model.toJSON(),
              worker: worker.id,
            });

            Logger.system(
              API_LOGGER_PREFIX,
              `Successfully sync ${model.getName()}.`,
            );
            return response;
          } catch (error) {
            Logger.error(
              API_LOGGER_PREFIX,
              `Failed to sync ${model.getName()} with the error ${error.toString()}`,
            );
            return error;
          }
        })(),
      );
    }
    try {
      await Promise.all(responses);

      Logger.system(API_LOGGER_PREFIX, `Start sync models with api.`);

      // Clear array
      responses.length = 0;

      for (const model of models) {
        responses.push(this.getDataModelByName(model.getName()));
      }

      const apiModels: APIDataModel[] = await Promise.all(responses);

      for (const model of apiModels) {
        this.cwire.getDataModelByName(model.name).sync(model);
      }

      Logger.system(API_LOGGER_PREFIX, `Successfully sync models with api.`);
    } catch (error) {
      if (error.response) {
        Logger.error(
          API_LOGGER_PREFIX,
          `Failed to sync data models ${JSON.stringify(error.response.data)}`,
        );
      }
      return error;
    }
  }

  async getDataModelByName(name: string) {
    return parseResponse<APIDataModel>(await this.api.get(`/models/${name}`));
  }

  async addEvent(
    type: DATA_MODEL_ENTITY_EVENTS,
    entityId: string,
    modelName: string,
    {
      icon,
      color,
      after = null,
      before = null,
      description = '',
    }: Partial<EntityEventOptions> = {},
  ) {
    return parseResponse(
      await this.api.post(`/models/${modelName}/entities/${entityId}/events`, {
        type,
        icon: icon || null,
        color: color || null,
        description: description || null,
        after: after && JSON.stringify(after),
        before: before && JSON.stringify(before),
      }),
    );
  }
}
