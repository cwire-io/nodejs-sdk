import Logger from '../../helper/logger';
import { DataModelQuery } from '../../types/DataModelQuery';

import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';
import { FIND_ONE_ENTITY_LOGGER_PREFIX } from '../../constants/logger';

export class FindOne
  extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery]> {
  async controller(modelName: string, query: DataModelQuery) {
    try {
      const dataModel = this.cwire.getDataModelByName(modelName);
      const entity = await dataModel.findOne(this.cwire, query);
      Logger.system(
        FIND_ONE_ENTITY_LOGGER_PREFIX,
        `Find one ${modelName} entity`,
      );

      return { success: true, data: entity };
    } catch (error) {
      Logger.error(FIND_ONE_ENTITY_LOGGER_PREFIX, error.toString());
    }

    return { success: true, data: null };
  }

  getName(): string {
    return 'DATA_MODEL::FIND_ONE';
  }

  getParameters(): WorkerAPIFunctionValueParameter[] {
    return [
      {
        type: 'option',
        name: 'modelName',
        isRequired: true,
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
