import axios from 'axios';

import { CWireAPI } from './CWireAPI';
import { DataModel } from './DataModel';

import {
  // Generic
  TextFieldType,
  NumberFieldType,
  CustomFieldType,
  BooleanFieldType,
  // Time
  DateFieldType,
  DateTimeFieldType,
  TimestampFieldType,
  // UI
  EmailFieldType,
  PasswordFieldType,
  DescriptionFieldType,
  MongoDBObjectIdFieldType,
} from './types/DataModelFields';
import { APIWorkerInfoType } from './types/Worker';

import Logger, { LogLevel } from './helper/logger';
import { WorkerFunctions } from './worker/functions';

import { CWireWebSocket } from './CWireWebSocket';
import { CONSTRUCT_REFERENCES_LOGGER_PREFIX } from './constants/logger';
import { CWireIsNotInitialised, DataModelNotFoundError } from './errors';

/**
 * @property {string} route
 * @property {string} apiURL
 * @property {LogLevel} logger
 * @property {DataModel} models
 */
interface CWireOptions {
  route?: string;
  apiURL?: string;
  logger?: LogLevel;
  models?: DataModel[];
}

/**
 * Main class for cwire SDK
 * @property {string} apiKey
 * @property {CWireOptions} options
 */
export class CWire {
  private static instance: CWire | null = null;
  public static FIELD_TYPES: {
    // Generic
    TEXT: TextFieldType;
    NUMBER: NumberFieldType;
    CUSTOM: CustomFieldType;
    BOOLEAN: BooleanFieldType;

    // MongoDB
    OBJECTID: MongoDBObjectIdFieldType;

    // UI
    EMAIL: EmailFieldType;
    PASSWORD: PasswordFieldType;
    DESCRIPTION: DescriptionFieldType;

    // Date
    DATE: DateFieldType;
    DATETIME: DateTimeFieldType;
    TIMESTAMP: TimestampFieldType;
  } = {
    // Generic
    TEXT: 'text',
    NUMBER: 'number',
    CUSTOM: 'custom',
    BOOLEAN: 'boolean',

    // MONGODB
    OBJECTID: 'objectId',

    // UI
    EMAIL: 'email',
    PASSWORD: 'password',
    DESCRIPTION: 'description',

    // TIME
    DATE: 'date',
    DATETIME: 'dateTime',
    TIMESTAMP: 'timestamp',
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
      Logger.setLogLevel(options.logger);
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
        await this.instance.constructReferences();
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

  private async constructReferences() {
    try {
      const nativeModels: { [key: string]: DataModel } = {};

      // MAP lib models to cwire data models
      for (const model of this.getDataModelsList()) {
        nativeModels[model.getName()] = model;
      }

      // Map field references to models
      for (const model of this.getDataModelsList()) {
        await model.constructReferences(this, nativeModels);
      }
    } catch (error) {
      Logger.error(
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

  public static getInstance(): CWire {
    if (!this.instance) {
      throw new CWireIsNotInitialised();
    }

    return this.instance;
  }

  public getDataModelByName(name: string) {
    if (!this.isDataModelExists(name)) {
      throw new DataModelNotFoundError();
    }

    return this.models[name];
  }

  public static dispatch(
    modelName: string,
    entityId: string,
    type: string,
    options: Partial<{
      after: any;
      before: any;
      icon: string;
      color: string;
      description: string;
    }> = {},
  ) {
    if (!this.getInstance()) {
      return new CWireIsNotInitialised();
    }

    return this.getInstance()
      .getDataModelByName(modelName)
      .addEntityEvent(entityId, type, options);
  }
}
