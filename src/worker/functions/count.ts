import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionParameters,
} from "../WorkerFunction";
import { DataModelQuery } from "../../types/DataModelQuery";
import { parseDataModelQueryToSequelizeQuery } from "../../helper/sequelize";

export class Count extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery]> {
  async controller(modelName: string, query: DataModelQuery) {
    const dataModel = this.cwire.getDataModelByName(modelName);

    switch (dataModel.getType()) {
      case "Sequelize":
        const numberOfEntities = await dataModel
          .getSequelizeModel()
          .count(parseDataModelQueryToSequelizeQuery(query));
        return {
          success: true,
          data: numberOfEntities || 0,
        };
      case "Mongoose":
      case "Custom":
        return { success: true, data: null };
    }

    return { success: true, data: null };
  }

  getName(): string {
    return "DATA_MODEL::COUNT";
  }

  getParameters(): WorkerAPIFunctionParameters {
    return [
      {
        type: "option",
        isRequired: true,
        name: "modelName",
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
