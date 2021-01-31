import { DataModelQuery } from '../../types/DataModelQuery';
import { WorkerFunction, IWorkerFunction, WorkerAPIFunctionValueParameter } from '../WorkerFunction';
export declare class Update extends WorkerFunction implements IWorkerFunction<[string, DataModelQuery, any], any[]> {
    controller(modelName: string, query: DataModelQuery, values: any): Promise<{
        success: boolean;
        data: any;
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionValueParameter[];
}
