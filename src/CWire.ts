import axios from 'axios';

import { CWireAPI } from './CWireAPI';
import { DataModel } from './DataModel';

import {
  AlertActionType,
  ButtonActionType,
  ToggleActionType,
} from './types/DataModelActions';
import {
  BooleanFieldType,
  CustomFieldType,
  DescriptionFieldType,
  EmailFieldType,
  NumberFieldType,
  PasswordFieldType,
  TextFieldType,
} from './types/DataModelFields';

import { APIWorkerInfoType } from './types/Worker';
import Logger, { LogLevel } from './helper/logger';
import { WorkerFunctions } from './worker/functions';

import { CWireWebSocket } from './CWireWebSocket';
import { DataModelNotFoundError } from './errors';

interface CWireOptions {
  route?: string;
  apiURL?: string;
  logger?: LogLevel;
  models?: DataModel[];
}

const CONSTRUCT_REFERENCES_LOGGER_PREFIX = 'CONSTRUCT_REFERENCES';

export class CWire {
  private logger: Logger;
  private static instance: CWire | null = null;
  public static FIELD_TYPES: {
    TEXT: TextFieldType;
    EMAIL: EmailFieldType;
    NUMBER: NumberFieldType;
    CUSTOM: CustomFieldType;
    BOOLEAN: BooleanFieldType;
    PASSWORD: PasswordFieldType;
    DESCRIPTION: DescriptionFieldType;
  } = {
    TEXT: 'text',
    EMAIL: 'email',
    NUMBER: 'number',
    CUSTOM: 'custom',
    BOOLEAN: 'boolean',
    PASSWORD: 'password',
    DESCRIPTION: 'description',
  };
  public static ACTIONS: {
    ALERT: AlertActionType;
    TOGGLE: ToggleActionType;
    BUTTON: ButtonActionType;
  } = {
    ALERT: 'alert',
    TOGGLE: 'toggle',
    BUTTON: 'button',
  };

  private api: CWireAPI;
  private apiKey: string;
  private websocket: CWireWebSocket;
  private worker?: APIWorkerInfoType;
  private workerFunctions: WorkerFunctions;
  private models: { [name: string]: DataModel } = {};
  private cwireRoute: string = '/cwire';
  private cwireAPIURL: string = 'https://api.cwire.io';

  constructor(apiKey: string, options: CWireOptions = {}) {
    this.apiKey = apiKey;

    if (options.logger) {
      this.logger = new Logger(options.logger);
    } else {
      this.logger = new Logger('debug');
    }

    if (options.apiURL) {
      this.cwireAPIURL = options.apiURL;
    }

    if (options.route) {
      this.cwireRoute = options.route;
    }

    if (options.models) {
      for (const model of options.models) {
        this.models[model.getName()] = model;
      }
    }

    this.workerFunctions = WorkerFunctions.init(this);
    this.websocket = new CWireWebSocket(this);
    this.api = new CWireAPI(
      this,
      axios.create({
        timeout: 10000,
        baseURL: this.cwireAPIURL,
        headers: { 'X-API-KEY': this.apiKey },
      }),
    );
  }

  public static async init(
    apiKey: string,
    options: CWireOptions = {},
  ): Promise<CWire> {
    if (!this.instance) {
      try {
        this.instance = new CWire(apiKey, options);
        this.instance.constructReferences();
        await this.instance.api.init();
        await this.instance.websocket.connect();
      } catch (err) {
        this.instance && this.instance.websocket.disconnect();
        delete this.instance;
        this.instance = null;
        throw err;
      }
    }

    return this.instance;
  }

  private constructReferences() {
    try {
      const nativeModels: { [key: string]: DataModel } = {};

      // MAP lib models to cwire data models
      for (const model of this.getDataModelsList()) {
        switch (model.getType()) {
          case DataModel.DATA_MODEL_TYPES.SEQUELIZE: {
            nativeModels[model.getSequelizeModel().getTableName()] = model;
            break;
          }
          case DataModel.DATA_MODEL_TYPES.MONGOOSE: {
            nativeModels[model.getMongooseModel().modelName] = model;
            break;
          }
        }
      }

      // Map field references to models
      for (const model of this.getDataModelsList()) {
        switch (model.getType()) {
          case DataModel.DATA_MODEL_TYPES.MONGOOSE: {
            const mongooseModel = model.getMongooseModel();
            for (const fieldName of Object.keys(mongooseModel.schema.paths)) {
              try {
                // @ts-ignore
                const ref = mongooseModel.schema.paths[fieldName].options.ref;
                if (
                  nativeModels[ref] &&
                  nativeModels[ref].getFieldByName('_id')
                ) {
                  model.getFieldByName(fieldName).setReference({
                    field: '_id',
                    model: nativeModels[ref].getName(),
                  });
                }
              } catch (error) {
                this.getLogger().error(
                  CONSTRUCT_REFERENCES_LOGGER_PREFIX,
                  `Failed to construct reference for ${fieldName} in ${model.getName()} with error ${error.toString()}`,
                );
              }
            }

            break;
          }
          case DataModel.DATA_MODEL_TYPES.SEQUELIZE: {
            for (const sequelizeField of Object.values(
              model.getSequelizeModel().rawAttributes,
            ) as any) {
              try {
                if (sequelizeField.references) {
                  const {
                    model: modelName,
                    key: field,
                  } = sequelizeField.references;
                  if (
                    nativeModels[modelName] &&
                    model.getFieldByName(sequelizeField.field)
                  ) {
                    model.getFieldByName(sequelizeField.field).setReference({
                      field,
                      model: nativeModels[modelName].getName(),
                    });
                  }
                }
              } catch (error) {
                this.getLogger().error(
                  CONSTRUCT_REFERENCES_LOGGER_PREFIX,
                  `Failed to construct reference for ${
                    sequelizeField.field
                  } in ${model.getName()} with error ${error.toString()}`,
                );
              }
            }

            break;
          }
        }
      }
    } catch (error) {
      this.getLogger().error(
        CONSTRUCT_REFERENCES_LOGGER_PREFIX,
        `Failed to construct field references ${error.toString()}`,
      );
    }
  }

  public getAPIURL(): string {
    return this.cwireAPIURL;
  }

  public getAPIKey(): string {
    return this.apiKey;
  }

  public getAPI(): CWireAPI {
    return this.api;
  }

  public getWorker(): APIWorkerInfoType | undefined {
    return this.worker;
  }

  public setWorker(worker: APIWorkerInfoType) {
    this.worker = worker;
  }

  public getWorkerFunctions(): WorkerFunctions {
    return this.workerFunctions;
  }

  public getAxios() {
    return this.api.getAxios();
  }

  public getDataModelsMap() {
    return this.models;
  }

  public getDataModelsList() {
    return Object.values(this.models);
  }

  public isDataModelExists(name: string): boolean {
    return !!this.models[name];
  }

  public getLogger(): Logger {
    return this.logger;
  }

  public getDataModelByName(name: string) {
    if (!this.isDataModelExists(name)) {
      throw new DataModelNotFoundError();
    }

    return this.models[name];
  }
}
