import { CWire } from "../CWire";
import { IWorkerFunction } from "./WorkerFunction";
export declare class WorkerFunctions {
    cwire: CWire;
    static instance: WorkerFunctions;
    functions: Map<string, IWorkerFunction<[], any[]>>;
    constructor(cwire: CWire);
    addFunction(fnInstance: any): void;
    removeFunction(fnName: string): void;
    isFunctionExisting(fnName: string): boolean;
    getFunction(fnName: string): IWorkerFunction<any[]> | undefined;
    getFunctionList(): IWorkerFunction[];
    static init(cwire: CWire): WorkerFunctions;
    static getInstance(): WorkerFunctions;
}
