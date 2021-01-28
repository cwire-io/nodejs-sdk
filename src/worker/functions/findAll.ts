import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';
import {
  buildEntitiesResponse,
  parseDataModelQueryToSequelizeQuery,
} from '../../helper/sequelize';
import { DataModelQuery } from '../../types/DataModelQuery';
import {
  buildMongooseEntitiesResponse,
  parseDataModelQueryToMongooseQuery,
} from '../../helper/mongoose';

const FIND_ALL_ENTITY_LOGGER_PREFIX = 'FIND_ALL_ENTITIES_ACTION';

export class FindAll
  extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery], any[]> {
  async controller(modelName: string, query: DataModelQuery) {
    const dataModel = this.cwire.getDataModelByName(modelName);

    try {
      switch (dataModel.getType()) {
        case 'Sequelize': {
          const entities = await dataModel
            .getSequelizeModel()
            .findAll(parseDataModelQueryToSequelizeQuery(query));
          this.cwire
            .getLogger()
            .system(
              FIND_ALL_ENTITY_LOGGER_PREFIX,
              `Find all entities by mongoose: ${entities}`,
            );
          return {
            success: true,
            data: buildEntitiesResponse(dataModel.getFieldsList(), entities),
          };
        }
        case 'Mongoose': {
          let mongooseQuery = dataModel
            .getMongooseModel()
            .find(parseDataModelQueryToMongooseQuery(query));

          if (query.limit && typeof query.limit === 'number') {
            mongooseQuery = mongooseQuery.limit(query.limit);
          }

          if (query.offset && typeof query.offset === 'number') {
            mongooseQuery = mongooseQuery.skip(query.offset);
          }
          const entities = await mongooseQuery.exec();
          this.cwire
            .getLogger()
            .system(
              FIND_ALL_ENTITY_LOGGER_PREFIX,
              `Find all entities by mongoose: ${entities}`,
            );
          return {
            success: true,
            data: buildMongooseEntitiesResponse(
              dataModel.getFieldsList(),
              entities,
            ),
          };
        }
        case 'Custom':
          return { success: true, data: [] };
      }
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
