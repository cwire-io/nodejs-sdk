import { CWire } from "../CWire";
import { FindAll } from "./functions/findAll";
import { IWorkerFunction } from "./WorkerFunction";
import { FindOne } from "./functions/findOne";

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
    this.instance.addFunction(FindAll);
    this.instance.addFunction(FindOne);
    return this.instance;
  }

  static getInstance() {
    return this.instance;
  }
}
