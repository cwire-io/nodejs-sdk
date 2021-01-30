import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';
import { DataModelQuery } from '../../types/DataModelQuery';

const REMOVE_ENTITIES_LOGGER_PREFIX = 'REMOVE_ENTITIES_ACTION';

export class Remove
  extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery], any[]> {
  async controller(modelName: string, query: DataModelQuery) {
    const dataModel = this.cwire.getDataModelByName(modelName);

    try {
      const result = await dataModel.getORM().remove(query);
      this.cwire
        .getLogger()
        .system(
          REMOVE_ENTITIES_LOGGER_PREFIX,
          `Remove ${dataModel} entities ${JSON.stringify(result)}`,
        );
      return { success: true, data: result };
    } catch (error) {
      this.cwire
        .getLogger()
        .error(
          REMOVE_ENTITIES_LOGGER_PREFIX,
          `Error on entity creation: ${error.toString()}`,
        );
    }

    return { success: true, data: [] };
  }

  getName(): string {
    return 'DATA_MODEL::REMOVE';
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
        type: 'query',
        name: 'query',
        isRequired: true,
      },
    ];
  }
}
