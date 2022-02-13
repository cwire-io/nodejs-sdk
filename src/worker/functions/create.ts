import Logger from '../../helper/logger';
import { CREATE_ENTITY_LOGGER_PREFIX } from '../../constants/logger';

import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';

export class Create
  extends WorkerFunction
  implements IWorkerFunction<[string, { [key: string]: any }]> {
  async controller(modelName: string, values: { [key: string]: any }) {
    try {
      const dataModel = this.cwire.getDataModelByName(modelName);
      const entity = await dataModel.create(this.cwire, values);
      Logger.system(
        CREATE_ENTITY_LOGGER_PREFIX,
        `Created new ${modelName} entity: ${JSON.stringify(entity)}`,
      );
      return {
        success: true,
        data: entity,
      };
    } catch (err) {
      Logger.error(
        CREATE_ENTITY_LOGGER_PREFIX,
        `Error on entity creation: ${err.toString()}`,
      );
      return { success: false, error: err };
    }

    return { success: true, data: null };
  }

  getName(): string {
    return 'DATA_MODEL::CREATE';
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
        name: 'values',
        type: 'values',
        isRequired: true,
      },
    ];
  }
}
