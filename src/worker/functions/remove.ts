import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from "../WorkerFunction";
import { DataModelQuery } from "../../types/DataModelQuery";
import { parseDataModelQueryToSequelizeQuery } from "../../helper/sequelize";
import { parseDataModelQueryToMongooseQuery } from "../../helper/mongoose";

export class Remove
  extends WorkerFunction
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
      case "Mongoose": {
        await dataModel
          .getMongooseModel()
          .remove(parseDataModelQueryToMongooseQuery(query))
          .exec();
        return { success: true };
      }
      case "Custom":
        return { success: true };
    }

    return { success: true, data: [] };
  }

  getName(): string {
    return "DATA_MODEL::REMOVE";
  }

  getParameters(): WorkerAPIFunctionValueParameter[] {
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
