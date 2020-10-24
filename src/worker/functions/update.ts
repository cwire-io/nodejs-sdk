import {
  WorkerAPIFunctionParameters,
  WorkerFunction,
  IWorkerFunction,
} from "../WorkerFunction";
import {
  buildEntitiesResponse,
  parseDataModelQueryToSequelizeQuery,
} from "../../helper/sequelize";
import { DataModelQuery } from "../../types/DataModelQuery";
import {
  buildMongooseEntitiesResponse,
  parseDataModelQueryToMongooseQuery,
} from "../../helper/mongoose";

export class Update extends WorkerFunction
  implements IWorkerFunction<[string, DataModelQuery, any], any[]> {
  async controller(modelName: string, query: DataModelQuery, values: any) {
    const dataModel = this.cwire.getDataModelByName(modelName);
    switch (dataModel.getType()) {
      case "Sequelize": {
        const entity = await dataModel
          .getSequelizeModel()
          .findOne(parseDataModelQueryToSequelizeQuery(query));

        if (!entity) {
          return { success: false };
        }

        await entity.update(values);
        return {
          success: true,
          data: buildEntitiesResponse(dataModel.getFieldsList(), [entity]),
        };
      }
      // Fix entity returning of updated entity
      case "Mongoose": {
        const entity = await dataModel
          .getMongooseModel()
          .update(parseDataModelQueryToMongooseQuery(query), values)
          .exec();
        return {
          success: true,
          data: buildMongooseEntitiesResponse(dataModel.getFieldsList(), [
            entity,
          ]),
        };
      }
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
        type: "query",
        name: "query",
        isRequired: true,
      },
      {
        type: "values",
        name: "values",
        isRequired: true,
      },
    ];
  }
}
