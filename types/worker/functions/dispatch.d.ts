import { WorkerFunction, IWorkerFunction, WorkerAPIFunctionValueParameter } from '../WorkerFunction';
export declare class Dispatch extends WorkerFunction implements IWorkerFunction<[string, string, string, string[]], any[]> {
    controller(clientId: string, modelName: string, action: string, entityIds: string[]): Promise<{
        success: boolean;
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionValueParameter[];
}
