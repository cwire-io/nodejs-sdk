import { DataModelQuery } from '../../types/DataModelQuery';
import { WorkerFunction, IWorkerFunction, WorkerAPIFunctionValueParameter } from '../WorkerFunction';
export declare class FindAll extends WorkerFunction implements IWorkerFunction<[string, DataModelQuery], any[]> {
    controller(modelName: string, query: DataModelQuery): Promise<{
        success: boolean;
        data: any;
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionValueParameter[];
}
