import { WorkerAPIFunctionParameters, WorkerFunction, IWorkerFunction } from "../WorkerFunction";
export declare class FindOne extends WorkerFunction implements IWorkerFunction<[string, string]> {
    controller(modelName: string, id: string): Promise<{
        success: boolean;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionParameters;
}
