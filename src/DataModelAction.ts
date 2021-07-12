import {
  ActionConstructors,
  DataModelActionType,
  EntityActionOptions,
  EntityActionFunction,
  EntityActionFunction$One,
  EntityActionFunction$None, EntityActionFunction$Multiple,
} from './types/DataModelAction';
import { MissingRequiredPropertyError } from './errors';

export class DataModelAction {
  // @ts-ignore
  private name: string;
  // @ts-ignore
  private type: DataModelActionType;
  // @ts-ignore
  private options: EntityActionOptions;
  // @ts-ignore
  private handler: EntityActionFunction;

  private static ActionTypes = {
    ONE: 'one',
    NONE: 'none',
    MULTIPLE: 'multiple',
  };

  constructor(name: string, handler: EntityActionFunction$One);
  constructor(name: string, options: { type: 'one' } & EntityActionOptions , handler: EntityActionFunction$One);
  constructor(name: string, options: { type: 'none' } & EntityActionOptions , handler: EntityActionFunction$None);
  constructor(name: string, options: { type: 'multiple' } & EntityActionOptions, handler: EntityActionFunction$Multiple);

  constructor(...params: ActionConstructors) {
    const name = params[0];
    if (!name) {
      throw new MissingRequiredPropertyError();
    }

    if (typeof params[1] === 'function') {
      this.name = name;
      // @ts-ignore
      this.type = 'one';
      this.handler = params[1];
      return;
    }

    if (typeof params[1] === 'object' && typeof params[2] === 'function') {
      this.name = name;
      this.handler = params[2];
      const { type, ...options } = params[1];
      this.type = type;
      this.options = options;
      return;
    }

    throw new MissingRequiredPropertyError();
  }

  public getName(): string {
    return this.name;
  }

  public getType(): DataModelActionType {
    return this.type;
  }

  public getHandler(): EntityActionFunction {
    return this.handler;
  }

  public callHandler(...params: any[]): any {
    // @ts-ignore
    return this.handler(...params);
  }

  public toJSON(): { name: string; type: DataModelActionType } {
    return {
      name: this.name,
      type: this.type,
    };
  }
}

export class Action extends DataModelAction {}
export class ModelAction extends DataModelAction {
  constructor(
    ...params:
      | [string, EntityActionOptions, EntityActionFunction$None]
      | [string, EntityActionFunction$None]
  ) {
    const name = params[0];
    if (!name) {
      throw new MissingRequiredPropertyError();
    }

    if (typeof params[1] === 'function') {
      // @ts-ignore
      super(name, { type: 'none' }, params[1]);
      return;
    }

    if (typeof params[1] === 'object') {
      // @ts-ignore
      super(name, { type: 'none', ...params[1] }, params[2]);
    }

    throw new MissingRequiredPropertyError();
  }
}
export class SingleEntityAction extends DataModelAction {
  constructor(
    ...params:
      | [string, EntityActionFunction$One]
      | [string, EntityActionOptions, EntityActionFunction$One]
  ) {
    const name = params[0];
    if (!name) {
      throw new MissingRequiredPropertyError();
    }

    if (typeof params[1] === 'function' && typeof params[2] === 'function') {
      // @ts-ignore
      super(name, { type: 'one' }, params[1]);
      return;
    }

    if (typeof params[1] === 'object' && typeof params[2] === 'function') {
      // @ts-ignore
      super(name, { type: 'one', ...params[1] }, params[2]);
    }

    throw new MissingRequiredPropertyError();
  }
}
export class MultipleEntityAction extends DataModelAction {
  constructor(
    ...params:
      | [string, EntityActionFunction$One]
      | [string, EntityActionOptions, EntityActionFunction$One]
  ) {
    const name = params[0];
    if (!name) {
      throw new MissingRequiredPropertyError();
    }

    if (typeof params[1] === 'function') {
      // @ts-ignore
      super(name, { type: 'multiple' }, params[1]);
      return;
    }

    if (typeof params[1] === 'object') {
      // @ts-ignore
      super(name, { type: 'multiple', ...params[1] }, params[2]);
    }

    throw new MissingRequiredPropertyError();
  }
}
