import {
  DataModelActionOptionsType,
  DataModelActionType,
} from './types/DataModelActions';
import { CWire } from './CWire';
import { WrongActionTypeError } from './errors';

export class DataModelAction {
  private name: string;
  private type: DataModelActionType;
  constructor(name: string, options: DataModelActionOptionsType) {
    this.name = name;

    if (!DataModelAction.isValidActionType(options.type)) {
      throw new WrongActionTypeError();
    }

    this.type = options.type;
  }

  public getName(): string {
    return name;
  }

  public getType(): string {
    return this.type;
  }

  public toJSON() {
    return {
      name: this.name,
      type: this.type,
    };
  }

  public static isValidActionType(type: any): boolean {
    if (typeof type !== 'string') return false;

    // @ts-ignore
    return !!CWire.ACTIONS[type.toUpperCase()];
  }
}
