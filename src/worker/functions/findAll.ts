import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';
import { DataModelQuery } from '../../types/DataModelQuery';

const FIND_ALL_ENTITY_LOGGER_PREFIX = 'FIND_ALL_ENTITIES_ACTION';

export class FindAll
  extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery], any[]> {
  async controller(modelName: string, query: DataModelQuery) {
    const dataModel = this.cwire.getDataModelByName(modelName);

    try {
      const entities = await dataModel.getORM().findAll(query);
      this.cwire
        .getLogger()
        .system(
          FIND_ALL_ENTITY_LOGGER_PREFIX,
          `Find all ${dataModel} entities: ${entities}`,
        );
      return {
        success: true,
        data: entities,
      };
    } catch (err) {
      this.cwire
        .getLogger()
        .error(
          FIND_ALL_ENTITY_LOGGER_PREFIX,
          `Error on entity creation: ${err.toString()}`,
        );
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
