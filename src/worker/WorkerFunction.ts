import { CWire } from "../CWire";

export type WorkerAPIFunctionParameters = {
  type: "string" | "option" | "identifier" | "values" | "query";
  options?: string[];
  name: string;
  default?: any;
  isRequired?: boolean;
}[];
export abstract class IWorkerFunction<
  TParameters extends any[] = [],
  TResponse = any
> {
  abstract getName(): string;
  abstract getParameters(): WorkerAPIFunctionParameters;
  abstract async controller(
    ...args: TParameters
  ): Promise<{ data?: TResponse; error?: Error; success: boolean }>;
}
export class WorkerFunction {
  cwire: CWire;

  constructor(cwire: CWire) {
    this.cwire = cwire;
  }
}
