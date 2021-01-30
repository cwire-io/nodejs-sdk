import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';

export class Dispatch
  extends WorkerFunction
  implements IWorkerFunction<[string], any[]> {
  async controller(modelName: string) {
    return { success: true, data: [] };
  }

  getName(): string {
    return 'DATA_MODEL::DISPATCH';
  }

  getParameters(): WorkerAPIFunctionValueParameter[] {
    return [
      {
        type: 'option',
        options: this.cwire.getDataModelsList().map((model) => model.getName()),
        name: 'modelName',
        isRequired: true,
      },
    ];
  }
}
