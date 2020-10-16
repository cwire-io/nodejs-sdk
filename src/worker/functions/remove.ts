import {
  WorkerAPIFunctionParameters,
  WorkerFunction,
  IWorkerFunction,
} from "../WorkerFunction";

export class Remove extends WorkerFunction
  implements IWorkerFunction<[string, string], any[]> {
  async controller(modelName: string, id: string) {
    const dataModel = this.cwire.getDataModelByName(modelName);
    const primaryKey = dataModel.getPrimaryKey();

    switch (dataModel.getType()) {
      case "Sequelize": {
        await dataModel
          .getSequelizeModel()
          .destroy({ where: { [primaryKey]: id } });
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
        name: "id",
        isRequired: true,
        type: "identifier",
      },
    ];
  }
}
