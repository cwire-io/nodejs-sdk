import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';
import { DataModelQuery } from '../../types/DataModelQuery';
import {
  buildEntitiesResponse,
  parseDataModelQueryToSequelizeQuery,
} from '../../helper/sequelize';
import {
  buildMongooseEntitiesResponse,
  parseDataModelQueryToMongooseQuery,
} from '../../helper/mongoose';

const FIND_ONE_ENTITY_LOGGER_PREFIX = 'FIND_ONE_ENTITY_ACTION';

export class FindOne
  extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery]> {
  async controller(modelName: string, query: DataModelQuery) {
    const dataModel = this.cwire.getDataModelByName(modelName);

    try {
      switch (dataModel.getType()) {
        case 'Sequelize': {
          const entity = await dataModel
            .getSequelizeModel()
            .findOne(parseDataModelQueryToSequelizeQuery(query));
          if (!entity) {
            return { success: true };
          }

          this.cwire
            .getLogger()
            .system(
              FIND_ONE_ENTITY_LOGGER_PREFIX,
              `Find one entity by sequelize: ${JSON.stringify(entity)}`,
            );

          return {
            success: true,
            data: buildEntitiesResponse(dataModel.getFieldsList(), [entity]),
          };
        }
        case 'Mongoose': {
          let mongooseQuery = dataModel
            .getMongooseModel()
            .findOne(parseDataModelQueryToMongooseQuery(query));

          if (query.limit && typeof query.limit === 'number') {
            mongooseQuery = mongooseQuery.limit(query.limit);
          }

          if (query.offset && typeof query.offset === 'number') {
            mongooseQuery = mongooseQuery.skip(query.offset);
          }
          const entity = await mongooseQuery.exec();

          this.cwire
            .getLogger()
            .system(
              FIND_ONE_ENTITY_LOGGER_PREFIX,
              `Find one entity by mongoose: ${JSON.stringify(entity)}`,
            );

          return {
            success: true,
            data: buildMongooseEntitiesResponse(dataModel.getFieldsList(), [
              entity,
            ]),
          };
        }
        case 'Custom':
          return { success: true, data: null };
      }
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
