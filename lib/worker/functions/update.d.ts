import { WorkerAPIFunctionParameters, WorkerFunction, IWorkerFunction } from "../WorkerFunction";
export declare class Update extends WorkerFunction implements IWorkerFunction<[string, string, any], any[]> {
    controller(modelName: string, id: string, values: any): Promise<{
        success: boolean;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionParameters;
}
