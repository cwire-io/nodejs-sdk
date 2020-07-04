import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";

import { DataModel } from "./DataModel";
import { DataModelFieldType } from "./DataModelField";
import { DataModelActionType } from "./DataModelAction";

interface CWireOptions {
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

  private apiKey: string;
  private cwireAPI: string = "https://api.cwire.io/";

  constructor(apiKey: string, options: CWireOptions = {}) {
    this.apiKey = apiKey;
  }

  public static init(apiKey: string, options: CWireOptions = {}): CWire {
    this.instance = new CWire(apiKey, options);
    return this.instance;
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
