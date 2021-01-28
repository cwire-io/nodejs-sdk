import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';
import { DataModelQuery } from '../../types/DataModelQuery';
import { parseDataModelQueryToSequelizeQuery } from '../../helper/sequelize';
import { parseDataModelQueryToMongooseQuery } from '../../helper/mongoose';

const REMOVE_ENTITIES_LOGGER_PREFIX = 'REMOVE_ENTITIES_ACTION';

export class Remove
  extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery], any[]> {
  async controller(modelName: string, query: DataModelQuery) {
    const dataModel = this.cwire.getDataModelByName(modelName);
    const primaryKey = dataModel.getPrimaryKey();

    try {
      switch (dataModel.getType()) {
        case 'Sequelize': {
          const result = await dataModel
            .getSequelizeModel()
            .destroy(parseDataModelQueryToSequelizeQuery(query));
          this.cwire
            .getLogger()
            .system(
              REMOVE_ENTITIES_LOGGER_PREFIX,
              `Remove entities by sequelize ${JSON.stringify(result)}`,
            );
          return { success: true };
        }
        case 'Mongoose': {
          const result = await dataModel
            .getMongooseModel()
            .remove(parseDataModelQueryToMongooseQuery(query))
            .exec();
          this.cwire
            .getLogger()
            .system(
              REMOVE_ENTITIES_LOGGER_PREFIX,
              `Remove entities by mongoose ${JSON.stringify(result)}`,
            );
          return { success: true };
        }
        case 'Custom':
          return { success: true };
      }
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
