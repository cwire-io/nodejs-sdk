import { SUM_LOGGER_PREFIX } from '../../constants/logger';

import { CWire } from '../../CWire';
import Logger from '../../helper/logger';

import {
  IWorkerFunction,
  WorkerAPIFunctionParameter,
  WorkerFunction,
} from '../WorkerFunction';
import { WorkerFunctions } from '../functions';
import { DataModelCalculationFunctions } from '../../types/DataModel';

export type AverageParameters = [string, string, Record<string, any>];

/**
 * @memberOf WorkerFunction
 * @property {cwire} CWire
 * @property {WorkerFunctions} workerFunctions
 */
export class Sum
  extends WorkerFunction
  implements IWorkerFunction<AverageParameters> {
  async controller(
    modelName: string,
    fieldName: string,
    query: Record<any, string>,
  ): Promise<{ data?: any; error?: Error; success: boolean }> {
    try {
      const dataModel = this.cwire.getDataModelByName(modelName);

      const data = await dataModel.calculate(
        this.cwire,
        DataModelCalculationFunctions.SUM,
        fieldName,
        query,
      );
      Logger.system(SUM_LOGGER_PREFIX, `Run sum calculation`);
      return { success: true, data };
    } catch (error) {
      Logger.error(
        SUM_LOGGER_PREFIX,
        `Error on sum calculation: ${error.toString()}`,
      );

      return { success: false, data: null };
    }
  }

  getName(): string {
    return 'DATA_MODEL::SUM';
  }

  getParameters(): WorkerAPIFunctionParameter[] {
    return [
      {
        type: 'option',
        name: 'modelName',
        isRequired: true,
        options: this.cwire.getDataModelsList().map((model) => model.getName()),
      },
      {
        type: 'option',
        name: 'fieldName',
        isRequired: true,
        options: this.cwire
          .getDataModelsList()
          .reduce<string[]>((fields, model) => {
            return [
              ...fields,
              ...model.getFieldsList().map((field) => field.getName()),
            ];
          }, []),
      },
      {
        default: {},
        type: 'query',
        name: 'query',
        isRequired: false,
      },
    ];
  }
}
