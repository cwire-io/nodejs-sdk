import { CWire } from "../CWire";

export type WorkerAPIFunctionValueParameter = {
  type: "string" | "option" | "identifier" | "values" | "query";
  options?: string[];
  name: string;
  default?: any;
  isRequired?: boolean;
};
export type WorkerAPIFunctionParameterGroup = {
  name: string;
  type: "group";
  parameters: (WorkerAPIFunctionValueParameter | WorkerAPIFunctionParameterGroup | WorkerAPIFunctionParameterGroup[])[];
};
export type WorkerAPIFunctionParameter =
  | WorkerAPIFunctionValueParameter
  | WorkerAPIFunctionParameterGroup;
export abstract class IWorkerFunction<
  TParameters extends any[] = [],
  TResponse = any[]
> {
  abstract getName(): string;
  abstract getParameters(): WorkerAPIFunctionParameter[];
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
