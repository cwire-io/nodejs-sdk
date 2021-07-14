import {
  WorkerFunction,
  IWorkerFunction,
  WorkerAPIFunctionValueParameter,
} from '../WorkerFunction';

export class Dispatch
  extends WorkerFunction
  implements IWorkerFunction<[string, string, string, string[]], any[]> {
  async controller(
    clientId: string,
    modelName: string,
    action: string,
    entityIds: string[],
  ) {
    const model = this.cwire.getDataModelByName(modelName);

    if (!model) {
      return { success: false };
    }

    const modelAction = model.getActionByName(action);
    if (!modelAction) {
      return { success: false };
    }

    const options = { clientId };

    switch (modelAction.getType()) {
      case 'none': {
        // @ts-ignore
        await modelAction.callHandler(options);
        break;
      }
      case 'one': {
        // @ts-ignore
        await modelAction.callHandler(entityIds[0], options);
        break;
      }
      case 'multiple': {
        // @ts-ignore
        await modelAction.callHandler(entityIds, options);
        break;
      }
      default: {
        return { success: false };
      }
    }

    return { success: true };
  }

  getName(): string {
    return 'DATA_MODEL::DISPATCH_ACTION';
  }

  getParameters(): WorkerAPIFunctionValueParameter[] {
    return [
      {
        name: 'clientId',
        type: 'string',
        isRequired: true,
      },
      {
        type: 'option',
        options: this.cwire.getDataModelsList().map((model) => model.getName()),
        name: 'modelName',
        isRequired: true,
      },
      {
        type: 'option',
        name: 'action',
        isRequired: true,
        options: this.cwire
          .getDataModelsList()
          .map((model) =>
            model.getActionsList().map((action) => action.getName()),
          )
          .reduce((current, actions) => [...current, ...actions], []),
      },
      {
        name: 'entityIds',
        type: 'values',
        isRequired: false,
      },
    ];
  }
}
