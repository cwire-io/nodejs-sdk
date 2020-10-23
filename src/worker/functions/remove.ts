import {
  WorkerAPIFunctionParameters,
  WorkerFunction,
  IWorkerFunction,
} from "../WorkerFunction";
import { DataModelQuery } from "../../types/DataModelQuery";
import { parseDataModelQueryToSequelizeQuery } from "../../helper/sequelize";

export class Remove extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery], any[]> {
  async controller(modelName: string, query: DataModelQuery) {
    const dataModel = this.cwire.getDataModelByName(modelName);
    const primaryKey = dataModel.getPrimaryKey();

    switch (dataModel.getType()) {
      case "Sequelize": {
        await dataModel
          .getSequelizeModel()
          .destroy(parseDataModelQueryToSequelizeQuery(query));
        return { success: true };
      }
      case "Mongoose":
      case "Custom":
        return { success: true };
    }

    return { success: true, data: [] };
  }

  getName(): string {
    return "DATA_MODEL::REMOVE";
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
        type: "query",
        name: "query",
        isRequired: true,
      },
    ];
  }
}
