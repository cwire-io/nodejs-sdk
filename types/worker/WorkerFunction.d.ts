import { CWire } from "../CWire";
export declare type WorkerAPIFunctionValueParameter = {
    type: "string" | "option" | "identifier" | "values" | "query";
    options?: string[];
    name: string;
    default?: any;
    isRequired?: boolean;
};
export declare type WorkerAPIFunctionParameterGroup = {
    name: string;
    type: "group";
    parameters: (WorkerAPIFunctionValueParameter | WorkerAPIFunctionParameterGroup | WorkerAPIFunctionParameterGroup[])[];
};
export declare type WorkerAPIFunctionParameter = WorkerAPIFunctionValueParameter | WorkerAPIFunctionParameterGroup;
export declare abstract class IWorkerFunction<TParameters extends any[] = [], TResponse = any[]> {
    abstract getName(): string;
    abstract getParameters(): WorkerAPIFunctionParameter[];
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
