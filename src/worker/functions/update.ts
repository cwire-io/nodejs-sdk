import { DataModelQuery } from '../../types/DataModelQuery';
import { UPDATE_ENTITIES_LOGGER_PREFIX } from '../../constants/logger';

import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';

export class Update
  extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery, any], any[]> {
  async controller(modelName: string, query: DataModelQuery, values: any) {
    try {
      const dataModel = this.cwire.getDataModelByName(modelName);
      const entities = await dataModel.update(this.cwire, query, values);
      this.cwire
        .getLogger()
        .system(
          UPDATE_ENTITIES_LOGGER_PREFIX,
          `Update ${dataModel} entities ${JSON.stringify(entities)}`,
        );
      return { success: true, data: entities };
    } catch (error) {
      this.cwire
        .getLogger()
        .error(
          UPDATE_ENTITIES_LOGGER_PREFIX,
          `Error on entity creation: ${error.toString()}`,
        );
    }

    return { success: true, data: [] };
  }

  getName(): string {
    return 'DATA_MODEL::UPDATE';
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
      {
        type: 'values',
        name: 'values',
        isRequired: true,
      },
    ];
  }
}
