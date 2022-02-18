import { CWire } from '../../CWire';
import { WorkerFunction, IWorkerFunction, WorkerAPIFunctionParameter } from '../WorkerFunction';
import { WorkerFunctions } from '../functions';
export declare type AverageParameters = [];
export declare class Average extends WorkerFunction implements IWorkerFunction<AverageParameters> {
    private workerFunctions;
    constructor(cwire: CWire, workerFunctions: WorkerFunctions);
    controller(): Promise<{
        data?: any;
        error?: Error;
        success: boolean;
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionParameter[];
}
