import {
  WorkerAPIFunctionParameters,
  WorkerFunction,
  IWorkerFunction,
} from "../WorkerFunction";
import { buildEntitiesResponse } from "../../helper/sequelize";

export class FindOrCreate extends WorkerFunction
  implements IWorkerFunction<[string, { [key: string]: any }]> {
  async controller(modelName: string, values: { [key: string]: any }) {
    const dataModel = this.cwire.getDataModelByName(modelName);

    switch (dataModel.getType()) {
      case "Sequelize":
        try {
          const entity = await dataModel.getSequelizeModel().create(values);
          return {
            success: true,
            data: buildEntitiesResponse(dataModel.getFieldsList(), [entity]),
          };
        } catch (err) {
          return { success: false, error: err };
        }
      case "Mongoose":
      case "Custom":
        return { success: true, data: null };
    }

    return { success: true, data: null };
  }

  getName(): string {
    return "DATA_MODEL::FIND_OR_CREATE";
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
        name: "query",
        type: "query",
        isRequired: true,
      },
      {
        name: "values",
        type: "values",
        isRequired: true,
      },
    ];
  }
}
