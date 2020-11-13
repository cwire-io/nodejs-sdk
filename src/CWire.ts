import axios from "axios";

import { CWireAPI } from "./CWireAPI";
import { DataModel } from "./DataModel";

import {
  AlertActionType,
  ButtonActionType,
  ToggleActionType,
} from "./types/DataModelActions";
import {
  BooleanFieldType,
  CustomFieldType,
  DescriptionFieldType,
  EmailFieldType,
  NumberFieldType,
  PasswordFieldType,
  TextFieldType,
} from "./types/DataModelFields";
import { DataModelNotFoundError } from "./errors";
import { CWireWebSocket } from "./CWireWebSocket";
import { WorkerFunctions } from "./worker/functions";
import { APIWorkerInfoType } from "./types/Worker";

interface CWireOptions {
  route?: string;
  apiURL?: string;
  models?: DataModel[];
}

export class CWire {
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
    TEXT: "text",
    EMAIL: "email",
    NUMBER: "number",
    CUSTOM: "custom",
    BOOLEAN: "boolean",
    PASSWORD: "password",
    DESCRIPTION: "description",
  };
  public static ACTIONS: {
    ALERT: AlertActionType;
    TOGGLE: ToggleActionType;
    BUTTON: ButtonActionType;
  } = {
    ALERT: "alert",
    TOGGLE: "toggle",
    BUTTON: "button",
  };

  private api: CWireAPI;
  private apiKey: string;
  private websocket: CWireWebSocket;
  private worker?: APIWorkerInfoType;
  private workerFunctions: WorkerFunctions;
  private models: { [name: string]: DataModel } = {};
  private cwireRoute: string = "/cwire";
  private cwireAPIURL: string = "http://api.cwire.io";

  constructor(apiKey: string, options: CWireOptions = {}) {
    this.apiKey = apiKey;

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
        headers: { "X-API-KEY": this.apiKey },
      })
    );
  }

  public static async init(
    apiKey: string,
    options: CWireOptions = {}
  ): Promise<CWire> {
    if (!this.instance) {
      try {
        this.instance = new CWire(apiKey, options);
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

  public getDataModelByName(name: string) {
    if (!this.isDataModelExists(name)) {
      throw new DataModelNotFoundError();
    }

    return this.models[name];
  }
}