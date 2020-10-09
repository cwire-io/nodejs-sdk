import { WorkerAPIFunctionParameters, WorkerFunction, IWorkerFunction } from "../WorkerFunction";
export declare class FindOne extends WorkerFunction implements IWorkerFunction<[string]> {
    controller(modelName: string): Promise<{
        success: boolean;
        data: import("sequelize/types").Model<any, any> | null;
    }>;
    getName(): string;
    getParameters(): WorkerAPIFunctionParameters;
}
