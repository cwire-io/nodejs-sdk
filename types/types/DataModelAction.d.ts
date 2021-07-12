export declare type DataModelActionType = 'none' | 'one' | 'multiple';
export declare type ActionTriggerParameters = {
    clientId: string;
};
export declare type EntityActionFunction$None = (options: ActionTriggerParameters) => void;
export declare type EntityActionFunction$One = (entityId: string, options: ActionTriggerParameters) => void;
export declare type EntityActionFunction$Multiple = (entityIds: string[], options: ActionTriggerParameters) => void;
export declare type EntityActionFunction = EntityActionFunction$None | EntityActionFunction$One | EntityActionFunction$Multiple;
export declare type EntityActionOptions = Partial<{}>;
export declare type EntityAction = [string, EntityActionFunction$One];
export declare type OneEntityAction = [string, {
    type: 'one';
} & EntityActionOptions, EntityActionFunction$One];
export declare type NoneEntityAction = [string, {
    type: 'none';
} & EntityActionOptions, EntityActionFunction$None];
export declare type MultipleEntityAction = [string, {
    type: 'multiple';
} & EntityActionOptions, EntityActionFunction$Multiple];
export declare type ActionConstructors = EntityAction | NoneEntityAction | OneEntityAction | MultipleEntityAction;
