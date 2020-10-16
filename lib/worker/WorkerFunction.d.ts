import { CWire } from "../CWire";
export declare type WorkerAPIFunctionParameters = {
    type: "string" | "option" | "identifier" | "values";
    options?: string[];
    name: string;
    isRequired?: boolean;
}[];
export declare abstract class IWorkerFunction<TParameters extends any[] = [], TResponse = any> {
    abstract getName(): string;
    abstract getParameters(): WorkerAPIFunctionParameters;
    abstract controller(...args: TParameters): Promise<{
        data?: TResponse;
        error?: Error;
        success: boolean;
    }>;
}
export declare class WorkerFunction {
    cwire: CWire;
    constructor(cwire: CWire);
}
