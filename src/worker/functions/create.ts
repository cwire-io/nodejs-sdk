import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';
import { buildEntitiesResponse } from '../../helper/sequelize';
import { buildMongooseEntitiesResponse } from '../../helper/mongoose';

const CREATE_ENTITY_LOGGER_PREFIX = 'CREATE_ENTITY_ACTION';

export class Create
  extends WorkerFunction
  implements IWorkerFunction<[string, { [key: string]: any }]> {
  async controller(modelName: string, values: { [key: string]: any }) {
    const dataModel = this.cwire.getDataModelByName(modelName);

    try {
      switch (dataModel.getType()) {
        case 'Sequelize': {
          const entity = await dataModel.getSequelizeModel().create(values);
          this.cwire
            .getLogger()
            .system(
              CREATE_ENTITY_LOGGER_PREFIX,
              `Created new entity by sequelize: ${JSON.stringify(entity)}`,
            );
          return {
            success: true,
            data: buildEntitiesResponse(dataModel.getFieldsList(), [entity]),
          };
        }
        case 'Mongoose': {
          const entity = await dataModel.getMongooseModel().create(values);
          this.cwire
            .getLogger()
            .system(
              CREATE_ENTITY_LOGGER_PREFIX,
              `Created new entity by mongoose: ${JSON.stringify(entity)}`,
            );
          return {
            success: true,
            data: buildMongooseEntitiesResponse(dataModel.getFieldsList(), [
              entity,
            ]),
          };
        }
        case 'Custom':
          this.cwire
            .getLogger()
            .system(CREATE_ENTITY_LOGGER_PREFIX, `Created new entity: unkown`);
          // TODO: Implement
          return { success: true, data: null };
      }
    } catch (err) {
      this.cwire
        .getLogger()
        .error(
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
