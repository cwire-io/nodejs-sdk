import { CWire } from "../CWire";
import { FindAll } from "./functions/findAll";
import { IWorkerFunction } from "./WorkerFunction";
import { FindOne } from "./functions/findOne";
import { Create } from "./functions/create";
import { Remove } from "./functions/remove";
import { Update } from "./functions/update";
import { Dispatch } from "./functions/dispatch";
import { FindOrCreate } from "./functions/findOrCreate";
import { Count } from "./functions/count";

export class WorkerFunctions {
  cwire: CWire;
  static instance: WorkerFunctions;
  functions = new Map<string, IWorkerFunction>();

  constructor(cwire: CWire) {
    this.cwire = cwire;
  }

  addFunction(FnClass: any): void {
    const fnInstance = new FnClass(this.cwire);
    this.functions.set(fnInstance.getName(), fnInstance);
  }
  removeFunction(fnName: string): void {
    this.functions.delete(fnName);
  }

  isFunctionExisting(fnName: string): boolean {
    return this.functions.has(fnName);
  }

  getFunction(fnName: string): IWorkerFunction | undefined {
    return this.functions.get(fnName);
  }

  getFunctionList(): IWorkerFunction[] {
    return Array.from(this.functions.values());
  }

  static init(cwire: CWire) {
    if (!this.instance) {
      this.instance = new WorkerFunctions(cwire);
    }

    // Init worker Functions
    this.instance.addFunction(Count);
    this.instance.addFunction(Create);
    this.instance.addFunction(Remove);
    this.instance.addFunction(Update);
    this.instance.addFunction(FindAll);
    this.instance.addFunction(FindOne);
    this.instance.addFunction(Dispatch);
    this.instance.addFunction(FindOrCreate);
    return this.instance;
  }

  static getInstance() {
    return this.instance;
  }
}
