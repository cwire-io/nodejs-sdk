import {CWire} from "../CWire";

export type WorkerAPIFunctionParameters = { type: 'string' | 'option', options?: string[], name: string, isRequired: boolean }[];
export abstract class IWorkerFunction<TParameters extends any[] = []> {
  abstract getName(): string;
  abstract getParameters(): WorkerAPIFunctionParameters;
  abstract controller(...args: TParameters): any;
}
export class WorkerFunction {
  cwire: CWire;

  constructor(cwire: CWire) {
      this.cwire = cwire;
  }
}
