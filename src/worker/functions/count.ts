import Logger from '../../helper/logger';
import { DataModelQuery } from '../../types/DataModelQuery';
import { COUNT_ENTITY_LOGGER_PREFIX } from '../../constants/logger';

import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';

export class Count
  extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery]> {
  async controller(modelName: string, query: DataModelQuery) {
    try {
      const dataModel = this.cwire.getDataModelByName(modelName);
      Logger.system(
        COUNT_ENTITY_LOGGER_PREFIX,
        `Count all ${modelName} entities with ${JSON.stringify(query)}.`,
      );
      return { success: true, data: await dataModel.count(this.cwire, query) };
    } catch (err) {
      Logger.error(
        COUNT_ENTITY_LOGGER_PREFIX,
        `Error on entity creation: ${err.toString()}`,
      );
    }

    return { success: true, data: null };
  }

  getName(): string {
    return 'DATA_MODEL::COUNT';
  }

  getParameters(): WorkerAPIFunctionValueParameter[] {
    return [
      {
        type: 'option',
        isRequired: true,
        name: 'modelName',
        options: this.cwire.getDataModelsList().map((model) => model.getName()),
      },
      {
        default: {},
        type: 'query',
        name: 'query',
        isRequired: false,
      },
    ];
  }
}
