import { WorkerAPIFunctionParameters, WorkerFunction, IWorkerFunction } from "../WorkerFunction";
export declare class GetEntities extends WorkerFunction implements IWorkerFunction<[string]> {
    controller(modelName: string): any;
    getName(): string;
    getParameters(): WorkerAPIFunctionParameters;
}
