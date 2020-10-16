import {
  WorkerAPIFunctionParameters,
  WorkerFunction,
  IWorkerFunction,
} from "../WorkerFunction";
import { buildEntitiesResponse } from "../../helper/sequelize";

export class Update extends WorkerFunction
  implements IWorkerFunction<[string, string, any], any[]> {
  async controller(modelName: string, id: string, values: any) {
    const dataModel = this.cwire.getDataModelByName(modelName);
    const primaryKey = dataModel.getPrimaryKey();

    switch (dataModel.getType()) {
      case "Sequelize": {
        const entity = await dataModel
          .getSequelizeModel()
          .findOne({ where: { [primaryKey]: id } });

        if (!entity) {
          return { success: false };
        }

        await entity.update(values);
        return {
          success: true,
          data: buildEntitiesResponse(dataModel.getFieldsList(), [entity]),
        };
      }
      case "Mongoose":
      case "Custom":
        return { success: true };
    }

    return { success: true, data: [] };
  }

  getName(): string {
    return "DATA_MODEL::UPDATE";
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
        name: "id",
        isRequired: true,
        type: "identifier",
      },
      {
        type: "values",
        name: "values",
        isRequired: true,
      },
    ];
  }
}
