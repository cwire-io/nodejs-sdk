import { WorkerFunction, IWorkerFunction, WorkerAPIFunctionParameters } from "../WorkerFunction";
import { DataModelQuery } from "../../types/DataModelQuery";
export declare class Count extends WorkerFunction implements IWorkerFunction<[string, DataModelQuery]> {
    controller(modelName: string, query: DataModelQuery): Promise<{
        success: boolean;
        data: any;
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionParameters;
}
