import { CWire } from "../CWire";
import { IWorkerFunction } from "./WorkerFunction";
export declare class WorkerFunctions {
    cwire: CWire;
    static instance: WorkerFunctions;
    functions: Map<string, IWorkerFunction<[]>>;
    constructor(cwire: CWire);
    addFunction(FnClass: any): void;
    removeFunction(fnName: string): void;
    isFunctionExisting(fnName: string): boolean;
    getFunction(fnName: string): IWorkerFunction | undefined;
    getFunctionList(): IWorkerFunction[];
    static init(cwire: CWire): WorkerFunctions;
    static getInstance(): WorkerFunctions;
}
