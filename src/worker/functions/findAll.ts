import {
  WorkerAPIFunctionParameters,
  WorkerFunction,
  IWorkerFunction,
} from "../WorkerFunction";

export class FindAll extends WorkerFunction
  implements IWorkerFunction<[string], any[]> {
  async controller(modelName: string) {
    const dataModel = this.cwire.getDataModelByName(modelName);

    switch (dataModel.getType()) {
      case "Sequelize":
        const responseEntities: any[string] = [];
        const entities = await dataModel.getSequelizeModel().findAll({});
        for (const field of dataModel.getFieldsList()) {
          const responseEntity: any = {};
          for (const entity of entities) {
            responseEntity[field.getName()] = entity.get(field.getName());
          }
          responseEntities.push(responseEntity);
        }

        return { success: true, data: entities };
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
