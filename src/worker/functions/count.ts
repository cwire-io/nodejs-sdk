import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';
import { DataModelQuery } from '../../types/DataModelQuery';
import { parseDataModelQueryToSequelizeQuery } from '../../helper/sequelize';
import { parseDataModelQueryToMongooseQuery } from '../../helper/mongoose';

export class Count
  extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery]> {
  async controller(modelName: string, query: DataModelQuery) {
    const dataModel = this.cwire.getDataModelByName(modelName);

    switch (dataModel.getType()) {
      case 'Sequelize': {
        const numberOfEntities = await dataModel
          .getSequelizeModel()
          .count(parseDataModelQueryToSequelizeQuery(query));
        return {
          success: true,
          data: numberOfEntities || 0,
        };
      }
      // TODO: Fix it
      case 'Mongoose': {
        if (query.group) {
          const counts = await dataModel
            .getMongooseModel()
            .aggregate()
            .match(parseDataModelQueryToMongooseQuery(query))
            .group(query.group)
            .exec();
          return {
            success: true,
            data: counts,
          };
        } else {
          const numberOfEntities = await dataModel
            .getMongooseModel()
            .count(parseDataModelQueryToSequelizeQuery(query));
          return {
            success: true,
            data: numberOfEntities || 0,
          };
        }
      }
      case 'Custom':
        return { success: true, data: null };
    }

    return { success: true, data: null };
  }

  getName(): string {
    return 'DATA_MODEL::COUNT';
  }

  getParameters(): WorkerAPIFunctionValueParameter[] {
    return [
      {
        type: 'option',
        isRequired: true,
        name: 'modelName',
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
