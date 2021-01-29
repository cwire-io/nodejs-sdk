import { DataModel } from '../DataModel';
import { API_LOGGER_PREFIX, BaseAPI } from './BaseAPI';

export class DataModelAPI extends BaseAPI {
  async init() {
    try {
      this.cwire
        .getLogger()
        .system(API_LOGGER_PREFIX, 'Initialising worker data models.');
      await this.clearAllDataModels();
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
            const response = this.api.post('/models', {
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
      return await Promise.all(responses);
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

  async clearAllDataModels() {
    try {
      this.cwire
        .getLogger()
        .system(API_LOGGER_PREFIX, `Start clean up worker data models`);
      const response = this.api.post('/models/clear');
      this.cwire
        .getLogger()
        .system(
          API_LOGGER_PREFIX,
          `Successfully clean up all worker data models.`,
        );
      return response;
    } catch (error) {
      this.cwire
        .getLogger()
        .error(
          API_LOGGER_PREFIX,
          `Failed to clean up worker data models with the error ${error.toString()}`,
        );
      return error;
    }
  }

  async getAllDataModels() {
    return this.api.get('/models');
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
