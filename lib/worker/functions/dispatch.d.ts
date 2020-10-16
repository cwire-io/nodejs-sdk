import { WorkerAPIFunctionParameters, WorkerFunction, IWorkerFunction } from "../WorkerFunction";
export declare class Dispatch extends WorkerFunction implements IWorkerFunction<[string], any[]> {
    controller(modelName: string): Promise<{
        success: boolean;
        data?: undefined;
    } | {
        success: boolean;
        data: never[];
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionParameters;
}
