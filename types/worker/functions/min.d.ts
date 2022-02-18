import { IWorkerFunction, WorkerAPIFunctionParameter, WorkerFunction } from '../WorkerFunction';
export declare type AverageParameters = [string, string, Record<string, any>];
export declare class Min extends WorkerFunction implements IWorkerFunction<AverageParameters> {
    controller(modelName: string, fieldName: string, query: Record<any, string>): Promise<{
        data?: any;
        error?: Error;
        success: boolean;
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionParameter[];
}
