import {
  WorkerAPIFunctionParameters,
  WorkerFunction,
  IWorkerFunction,
} from "../WorkerFunction";
import { buildEntitiesResponse } from "../../helper/sequelize";

export class FindOne extends WorkerFunction
  implements IWorkerFunction<[string, string]> {
  async controller(modelName: string, id: string) {
    const dataModel = this.cwire.getDataModelByName(modelName);
    const primaryKey = dataModel.getPrimaryKey();

    switch (dataModel.getType()) {
      case "Sequelize": {
        const entity = await dataModel
          .getSequelizeModel()
          .findOne({ where: { [primaryKey]: id } });
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
        name: "id",
        isRequired: true,
        type: "identifier",
      },
    ];
  }
}
