import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';
import { DataModelQuery } from '../../types/DataModelQuery';

const FIND_ONE_ENTITY_LOGGER_PREFIX = 'FIND_ONE_ENTITY_ACTION';

export class FindOne
  extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery]> {
  async controller(modelName: string, query: DataModelQuery) {
    try {
      const dataModel = this.cwire.getDataModelByName(modelName);
      const entity = await dataModel.findOne(this.cwire, query);
      this.cwire
        .getLogger()
        .system(
          FIND_ONE_ENTITY_LOGGER_PREFIX,
          `Find one ${modelName} entity: ${JSON.stringify(entity)}`,
        );

      return { success: true, data: entity };
    } catch (error) {
      this.cwire
        .getLogger()
        .error(
          FIND_ONE_ENTITY_LOGGER_PREFIX,
          `Error on entity creation: ${error.toString()}`,
        );
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
