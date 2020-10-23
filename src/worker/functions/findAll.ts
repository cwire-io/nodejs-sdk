import {
  WorkerAPIFunctionParameters,
  WorkerFunction,
  IWorkerFunction,
} from "../WorkerFunction";
import {
  buildEntitiesResponse,
  parseDataModelQueryToSequelizeQuery,
} from "../../helper/sequelize";
import { DataModelQuery } from "../../types/DataModelQuery";

export class FindAll extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery], any[]> {
  async controller(modelName: string, query: DataModelQuery) {
    const dataModel = this.cwire.getDataModelByName(modelName);

    switch (dataModel.getType()) {
      case "Sequelize":
        const entities = await dataModel
          .getSequelizeModel()
          .findAll(parseDataModelQueryToSequelizeQuery(query));
        return {
          success: true,
          data: buildEntitiesResponse(dataModel.getFieldsList(), entities),
        };
      case "Mongoose":
      case "Custom":
        return { success: true, data: [] };
    }

    return { success: true, data: [] };
  }

  getName(): string {
    return "DATA_MODEL::FIND_ALL";
  }

  getParameters(): WorkerAPIFunctionParameters {
    return [
      {
        type: "option",
        options: this.cwire.getDataModelsList().map((model) => model.getName()),
        name: "modelName",
        isRequired: true,
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
