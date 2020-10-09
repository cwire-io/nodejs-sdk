import {
  WorkerAPIFunctionParameters,
  WorkerFunction,
  IWorkerFunction,
} from "../WorkerFunction";

export class FindOne extends WorkerFunction
  implements IWorkerFunction<[string]> {
  async controller(modelName: string) {
    const dataModel = this.cwire.getDataModelByName(modelName);

    switch (dataModel.getType()) {
      case "Sequelize":
        const data = await dataModel.getSequelizeModel().findOne({});
        const responseEntities: any[string] = [];
        const entities = await dataModel.getSequelizeModel().findAll({});
        for (const field of dataModel.getFieldsList()) {
          const responseEntity: any = {};
          for (const entity of entities) {
            responseEntity[field.getName()] = entity.get(field.getName());
          }
        }

        return { success: true, data };
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
    ];
  }
}
