import { WorkerAPIFunctionParameters, WorkerFunction, IWorkerFunction } from "../WorkerFunction";
export declare class Create extends WorkerFunction implements IWorkerFunction<[string, {
    [key: string]: any;
}]> {
    controller(modelName: string, values: {
        [key: string]: any;
    }): Promise<{
        success: boolean;
        data: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        data?: undefined;
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionParameters;
}
