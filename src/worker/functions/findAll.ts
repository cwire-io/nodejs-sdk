import {
  WorkerAPIFunctionParameters,
  WorkerFunction,
  IWorkerFunction,
} from "../WorkerFunction";
import { buildEntitiesResponse } from "../../helper/sequelize";

export class FindAll extends WorkerFunction
  implements IWorkerFunction<[string], any[]> {
  async controller(modelName: string) {
    const dataModel = this.cwire.getDataModelByName(modelName);

    switch (dataModel.getType()) {
      case "Sequelize":
        const entities = await dataModel.getSequelizeModel().findAll({});
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
    ];
  }
}
