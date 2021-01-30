import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';

export class FindOrCreate
  extends WorkerFunction
  implements IWorkerFunction<[string, { [key: string]: any }]> {
  async controller(modelName: string, values: { [key: string]: any }) {
    return { success: true, data: [] };
  }

  getName(): string {
    return 'DATA_MODEL::FIND_OR_CREATE';
  }

  getParameters(): WorkerAPIFunctionValueParameter[] {
    return [
      {
        type: 'option',
        options: this.cwire.getDataModelsList().map((model) => model.getName()),
        name: 'modelName',
        isRequired: true,
      },
      {
        name: 'query',
        type: 'query',
        isRequired: true,
      },
      {
        name: 'values',
        type: 'values',
        isRequired: true,
      },
    ];
  }
}
