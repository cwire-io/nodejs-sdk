import { WorkerAPIFunctionParameters, WorkerFunction, IWorkerFunction } from "../WorkerFunction";
export declare class Remove extends WorkerFunction implements IWorkerFunction<[string, string], any[]> {
    controller(modelName: string, id: string): Promise<{
        success: boolean;
        data?: undefined;
    } | {
        success: boolean;
        data: never[];
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionParameters;
}
