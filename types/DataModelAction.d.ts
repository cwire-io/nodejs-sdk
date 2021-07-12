import { DataModelActionType, EntityActionOptions, EntityActionFunction, EntityActionFunction$One, EntityActionFunction$None, EntityActionFunction$Multiple } from './types/DataModelAction';
export declare class DataModelAction {
    private name;
    private type;
    private options;
    private handler;
    private static ActionTypes;
    constructor(name: string, handler: EntityActionFunction$One);
    constructor(name: string, options: {
        type: 'one';
    } & EntityActionOptions, handler: EntityActionFunction$One);
    constructor(name: string, options: {
        type: 'none';
    } & EntityActionOptions, handler: EntityActionFunction$None);
    constructor(name: string, options: {
        type: 'multiple';
    } & EntityActionOptions, handler: EntityActionFunction$Multiple);
    getName(): string;
    getType(): DataModelActionType;
    getHandler(): EntityActionFunction;
    callHandler(...params: any[]): any;
    toJSON(): {
        name: string;
        type: DataModelActionType;
    };
}
export declare class Action extends DataModelAction {
}
export declare class ModelAction extends DataModelAction {
    constructor(...params: [string, EntityActionOptions, EntityActionFunction$None] | [string, EntityActionFunction$None]);
}
export declare class SingleEntityAction extends DataModelAction {
    constructor(...params: [string, EntityActionFunction$One] | [string, EntityActionOptions, EntityActionFunction$One]);
}
export declare class MultipleEntityAction extends DataModelAction {
    constructor(...params: [string, EntityActionFunction$One] | [string, EntityActionOptions, EntityActionFunction$One]);
}
