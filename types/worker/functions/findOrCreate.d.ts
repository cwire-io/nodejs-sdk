import { WorkerFunction, IWorkerFunction, WorkerAPIFunctionValueParameter } from '../WorkerFunction';
export declare class FindOrCreate extends WorkerFunction implements IWorkerFunction<[string, {
    [key: string]: any;
}]> {
    controller(modelName: string, values: {
        [key: string]: any;
    }): Promise<{
        success: boolean;
        data: never[];
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionValueParameter[];
}
