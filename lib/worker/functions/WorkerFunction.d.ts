import { CWire } from "../../CWire";
export declare type WorkerAPIFunctionParameters = {
    type: 'string';
    name: string;
    isRequired: boolean;
}[];
export declare abstract class IWorkerFunction<TParameters extends any[] = []> {
    abstract getName(): string;
    abstract getParameters(): WorkerAPIFunctionParameters;
    abstract controller(...args: TParameters): any;
}
export declare class WorkerFunction {
    cwire: CWire;
    constructor(cwire: CWire);
}
