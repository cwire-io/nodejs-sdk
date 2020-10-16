import { WorkerAPIFunctionParameters, WorkerFunction, IWorkerFunction } from "../WorkerFunction";
export declare class FindAll extends WorkerFunction implements IWorkerFunction<[string], any[]> {
    controller(modelName: string): Promise<{
        success: boolean;
        data: any;
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionParameters;
}
