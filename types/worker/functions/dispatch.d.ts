import { WorkerFunction, IWorkerFunction, WorkerAPIFunctionValueParameter } from '../WorkerFunction';
export declare class Dispatch extends WorkerFunction implements IWorkerFunction<[string], any[]> {
    controller(modelName: string): Promise<{
        success: boolean;
        data: never[];
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionValueParameter[];
}
