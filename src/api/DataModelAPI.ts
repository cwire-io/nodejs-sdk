import { DataModel } from '../DataModel';
import { parseResponse } from '../helper/api';
import { APIDataModel } from '../types/DataModel';

import { BaseAPI } from './BaseAPI';
import { API_LOGGER_PREFIX } from '../constants/logger';

export type DATA_MODEL_ENTITY_EVENTS =
  | 'CREATED'
  | 'UPDATED'
  | 'DELETED'
  | 'DISPATCHED'
  | string;

export class DataModelAPI extends BaseAPI {
  async init() {
    try {
      this.cwire
        .getLogger()
        .system(API_LOGGER_PREFIX, 'Initialising worker data models.');
      await this.syncModels(this.cwire.getDataModelsList());
      this.cwire
        .getLogger()
        .system(
          API_LOGGER_PREFIX,
          'Successfully initialising worker data models.',
        );
    } catch (error) {
      this.cwire
        .getLogger()
        .error(
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
            this.cwire.getLogger().system(
              API_LOGGER_PREFIX,
              `Start syncing ${model.getName()} model: ${JSON.stringify({
                ...model.toJSON(),
                worker: worker.name,
              })}`,
            );
            const response = this.api.post('/models/', {
              ...model.toJSON(),
              worker: worker.name,
            });

            this.cwire
              .getLogger()
              .system(
                API_LOGGER_PREFIX,
                `Successfully sync ${model.getName()}.`,
              );
            return response;
          } catch (error) {
            this.cwire
              .getLogger()
              .error(
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

      this.cwire
        .getLogger()
        .system(API_LOGGER_PREFIX, `Start sync models with api.`);

      // Clear array
      responses.length = 0;

      for (const model of models) {
        responses.push(this.getDataModelByName(model.getName()));
      }

      const apiModels: APIDataModel[] = await Promise.all(responses);

      for (const model of apiModels) {
        this.cwire.getDataModelByName(model.name).sync(model);
      }

      this.cwire
        .getLogger()
        .system(API_LOGGER_PREFIX, `Successfully sync models with api.`);
    } catch (error) {
      if (error.response) {
        this.cwire
          .getLogger()
          .error(
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
    event: DATA_MODEL_ENTITY_EVENTS,
    entityId: string,
    model: DataModel,
    {
      description = '',
      before = null,
      after = null,
    }: Partial<{ description: string; before: any; after: any }> = {},
  ) {
    return parseResponse(
      await this.api.post(`/models/${model.getName()}/events`, {
        event,
        entityId,
        description: description || null,
        after: after && JSON.stringify(after),
        before: before && JSON.stringify(before),
      }),
    );
  }

  /*
  public static parse(data: any | any[]): DataModel | DataModel[] {
    if (Array.isArray(data)) {
      const models: DataModel[] = [];
      for (const model of data) {
        const dataModel = new DataModel(model.name);
        dataModel.changeByObject(data);
        models.push(dataModel);
      }

      return models;
    }

    const model = new DataModel(data.name);
    model.changeByObject(data);
    return model;
  }
  */
}
