import { CWire } from '../CWire';
import { FindAll } from './functions/findAll';
import { IWorkerFunction } from './WorkerFunction';
import { FindOne } from './functions/findOne';
import { Create } from './functions/create';
import { Remove } from './functions/remove';
import { Update } from './functions/update';
import { Dispatch } from './functions/dispatch';
import { FindOrCreate } from './functions/findOrCreate';
import { Count } from './functions/count';
import { Bulk } from './functions/bulk';

export class WorkerFunctions {
  cwire: CWire;
  static instance: WorkerFunctions;
  functions = new Map<string, IWorkerFunction>();

  constructor(cwire: CWire) {
    this.cwire = cwire;
  }

  addFunction(fnInstance: any): void {
    this.functions.set(fnInstance.getName(), fnInstance);
  }
  removeFunction(fnName: string): void {
    this.functions.delete(fnName);
  }

  isFunctionExisting(fnName: string): boolean {
    return this.functions.has(fnName);
  }

  getFunction(fnName: string): IWorkerFunction<any[]> | undefined {
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
    this.instance.addFunction(new Count(cwire));
    this.instance.addFunction(new Create(cwire));
    this.instance.addFunction(new Remove(cwire));
    this.instance.addFunction(new Update(cwire));
    this.instance.addFunction(new FindAll(cwire));
    this.instance.addFunction(new FindOne(cwire));
    this.instance.addFunction(new Dispatch(cwire));
    this.instance.addFunction(new FindOrCreate(cwire));
    this.instance.addFunction(new Bulk(cwire, this.instance));
    return this.instance;
  }

  static getInstance() {
    return this.instance;
  }
}
