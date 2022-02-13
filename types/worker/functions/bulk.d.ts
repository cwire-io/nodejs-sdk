import { CWire } from '../../CWire';
import { WorkerFunction, IWorkerFunction, WorkerAPIFunctionParameter } from '../WorkerFunction';
import { WorkerFunctions } from '../functions';
export declare type BulkNodeType = {
    fn: string;
    parameters: any[];
};
export declare class Bulk extends WorkerFunction implements IWorkerFunction<BulkNodeType[]> {
    private workerFunctions;
    constructor(cwire: CWire, workerFunctions: WorkerFunctions);
    controller(...bulk: BulkNodeType[]): Promise<{
        data?: any;
        error?: Error;
        success: boolean;
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionParameter[];
}
