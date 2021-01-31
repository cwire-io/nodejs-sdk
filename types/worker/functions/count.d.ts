import { DataModelQuery } from '../../types/DataModelQuery';
import { WorkerFunction, IWorkerFunction, WorkerAPIFunctionValueParameter } from '../WorkerFunction';
export declare class Count extends WorkerFunction implements IWorkerFunction<[string, DataModelQuery]> {
    controller(modelName: string, query: DataModelQuery): Promise<{
        success: boolean;
        data: any;
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionValueParameter[];
}
