import { DataModelQuery } from '../../types/DataModelQuery';
import { FIND_ALL_ENTITY_LOGGER_PREFIX } from '../../constants/logger';

import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';

export class FindAll
  extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery], any[]> {
  async controller(modelName: string, query: DataModelQuery) {
    try {
      const dataModel = this.cwire.getDataModelByName(modelName);
      const entities = await dataModel.findAll(this.cwire, query);
      this.cwire
        .getLogger()
        .system(
          FIND_ALL_ENTITY_LOGGER_PREFIX,
          `Send ${entities.length} ${dataModel} entities:`,
        );
      return {
        success: true,
        data: entities,
      };
    } catch (error) {
      this.cwire
        .getLogger()
        .error(FIND_ALL_ENTITY_LOGGER_PREFIX, error.toString());
    }

    return { success: true, data: [] };
  }

  getName(): string {
    return 'DATA_MODEL::FIND_ALL';
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
        default: {},
        type: 'query',
        name: 'query',
        isRequired: false,
      },
    ];
  }
}
