import { WorkerAPIFunctionParameters, WorkerFunction, IWorkerFunction } from "../WorkerFunction";
import { DataModelQuery } from "../../types/DataModelQuery";
export declare class FindOne extends WorkerFunction implements IWorkerFunction<[string, DataModelQuery]> {
    controller(modelName: string, query: DataModelQuery): Promise<{
        success: boolean;
        data?: undefined;
    } | {
        success: boolean;
        data: any;
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionParameters;
}
