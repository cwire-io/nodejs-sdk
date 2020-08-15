import { WorkerAPIFunctionParameters, WorkerFunction, IWorkerFunction } from "../WorkerFunction";

export class GetEntities extends WorkerFunction implements IWorkerFunction<[string]> {
  controller(modelName: string): any {
    const dataModel = this.cwire.getDataModelByName(modelName);

    if (dataModel) {
      return dataModel.getOptions().get();
    }

    return [];
  }

  getName(): string {
    return "getEntities";
  }

  getParameters(): WorkerAPIFunctionParameters {
    return [{ type: 'option', options: this.cwire.getDataModelsList().map(model => model.getName()), name: 'modelName', isRequired: true }];
  }
}
