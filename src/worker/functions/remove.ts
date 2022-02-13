import Logger from '../../helper/logger';
import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';
import { DataModelQuery } from '../../types/DataModelQuery';
import { REMOVE_ENTITIES_LOGGER_PREFIX } from '../../constants/logger';

export class Remove
  extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery], any[]> {
  async controller(modelName: string, query: DataModelQuery) {
    try {
      const dataModel = this.cwire.getDataModelByName(modelName);
      const result = await dataModel.remove(this.cwire, query);
      Logger.system(
        REMOVE_ENTITIES_LOGGER_PREFIX,
        `Remove ${dataModel} entities ${JSON.stringify(result)}`,
      );
      return { success: true, data: result };
    } catch (error) {
      Logger.error(
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
