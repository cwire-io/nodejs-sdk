import { BULK_LOGGER_PREFIX } from '../../constants/logger';

import { CWire } from '../../CWire';
import { WorkerFunctions } from '../functions';
import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionParameter,
} from '../WorkerFunction';

export type BulkNodeType = {
  fn: string;
  parameters: any[];
};

/**
 * @memberOf WorkerFunction
 * @property {cwire} CWire
 * @property {WorkerFunctions} workerFunctions
 */
export class Bulk
  extends WorkerFunction
  implements IWorkerFunction<BulkNodeType[]> {
  private workerFunctions: WorkerFunctions;

  constructor(cwire: CWire, workerFunctions: WorkerFunctions) {
    super(cwire);
    this.workerFunctions = workerFunctions;
  }

  async controller(
    ...bulk: BulkNodeType[]
  ): Promise<{ data?: any; error?: Error; success: boolean }> {
    try {
      const promises = [];
      for (const task of bulk) {
        const workerFn = this.workerFunctions.getFunction(task.fn);
        if (workerFn) {
          promises.push(
            workerFn
              .controller(...task.parameters)
              .catch((error: Error) => ({ error: true, msg: error.stack })),
          );
        }
      }

      this.cwire
        .getLogger()
        .system(BULK_LOGGER_PREFIX, `Run bulk actions ${JSON.stringify(bulk)}`);
      return { success: true, data: await Promise.all(promises) };
    } catch (error) {
      this.cwire
        .getLogger()
        .error(
          BULK_LOGGER_PREFIX,
          `Error on entity creation: ${error.toString()}`,
        );

      return { success: false, data: null };
    }
  }

  getName(): string {
    return 'DATA_MODEL::BULK';
  }

  getParameters(): WorkerAPIFunctionParameter[] {
    return [
      {
        type: 'group',
        name: 'functions',
        parameters: [
          {
            type: 'option',
            default: null,
            isRequired: true,
            name: 'function',
            options: this.workerFunctions
              .getFunctionList()
              .map((workerFn) => workerFn.getName()),
          },
          this.workerFunctions.getFunctionList().map((workerFn) => ({
            type: 'group',
            name: 'parameters',
            parameters: workerFn.getParameters(),
          })),
        ],
      },
    ];
  }
}
