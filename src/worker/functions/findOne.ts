import {
  WorkerAPIFunctionParameters,
  WorkerFunction,
  IWorkerFunction,
} from "../WorkerFunction";
import { DataModelQuery } from "../../types/DataModelQuery";
import {
  buildEntitiesResponse,
  parseDataModelQueryToSequelizeQuery,
} from "../../helper/sequelize";

export class FindOne extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery]> {
  async controller(modelName: string, query: DataModelQuery) {
    const dataModel = this.cwire.getDataModelByName(modelName);
    const primaryKey = dataModel.getPrimaryKey();

    switch (dataModel.getType()) {
      case "Sequelize": {
        const entity = await dataModel
          .getSequelizeModel()
          .findOne(parseDataModelQueryToSequelizeQuery(query));
        if (!entity) {
          return { success: true };
        }

        return {
          success: true,
          data: buildEntitiesResponse(dataModel.getFieldsList(), [entity]),
        };
      }
      case "Mongoose":
      case "Custom":
        return { success: true, data: null };
    }

    return { success: true, data: null };
  }

  getName(): string {
    return "DATA_MODEL::FIND_ONE";
  }

  getParameters(): WorkerAPIFunctionParameters {
    return [
      {
        type: "option",
        name: "modelName",
        isRequired: true,
        options: this.cwire.getDataModelsList().map((model) => model.getName()),
      },
      {
        default: {},
        type: "query",
        name: "query",
        isRequired: false,
      },
    ];
  }
}
