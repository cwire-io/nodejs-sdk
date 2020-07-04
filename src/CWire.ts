import axios from 'axios';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import { CWireAPI } from './CWireAPI';
import { DataModel } from "./DataModel";
import { DataModelFieldType } from "./DataModelField";
import { DataModelActionType } from "./DataModelAction";

interface CWireOptions {
  url?: string;
  models?: DataModel[];
}

export class CWire {
  private static instance: CWire;
  public static FIELDS: { [key: string]: DataModelFieldType } = {
    TEXT: "text",
    EMAIL: "email",
    NUMBER: "number",
    CUSTOM: "custom",
    BOOLEAN: "boolean",
    PASSWORD: "password",
    DESCRIPTION: "description",
  };
  public static ACTIONS: { [key: string]: DataModelActionType } = {
    ALERT: "alert",
    TOGGLE: "toggle",
    BUTTON: "button",
  };

  private api: CWireAPI;
  private apiKey: string;
  private cwireAPIURL: string = "https://api.cwire.io";

  constructor(apiKey: string, options: CWireOptions = {}) {
    this.apiKey = apiKey;

    if (options.url) {
      this.cwireAPIURL = options.url;
    }

    this.api = new CWireAPI(axios.create({
      timeout: 10000,
      baseURL: this.cwireAPIURL,
      headers: { 'X-API-KEY': this.apiKey }
    }));
  }

  public static init(apiKey: string, options: CWireOptions = {}): CWire {
    this.instance = new CWire(apiKey, options);
    return this.instance;
  }


  public getAPI(): CWireAPI {
    return this.api;
  }

  public getAxios() {
    return this.api.getAxios();
  }

  public static getExpressMiddleware(): (
    req: ExpressRequest,
    res: ExpressResponse,
    next: () => void
  ) => Promise<void> {
    return async (
      req: ExpressRequest,
      res: ExpressResponse,
      next: () => void
    ) => {
      next();
    };
  }
}
