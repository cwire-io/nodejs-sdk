import { WorkerFunction, IWorkerFunction, WorkerAPIFunctionValueParameter } from "../WorkerFunction";
import { DataModelQuery } from "../../types/DataModelQuery";
export declare class Remove extends WorkerFunction implements IWorkerFunction<[string, DataModelQuery], any[]> {
    controller(modelName: string, query: DataModelQuery): Promise<{
        success: boolean;
        data?: undefined;
    } | {
        success: boolean;
        data: never[];
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionValueParameter[];
}
