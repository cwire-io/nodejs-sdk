import { WorkerFunction, IWorkerFunction, WorkerAPIFunctionValueParameter } from "../WorkerFunction";
import { DataModelQuery } from "../../types/DataModelQuery";
export declare class FindAll extends WorkerFunction implements IWorkerFunction<[string, DataModelQuery], any[]> {
    controller(modelName: string, query: DataModelQuery): Promise<{
        success: boolean;
        data: any;
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionValueParameter[];
}
