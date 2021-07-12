export type DataModelActionType = 'none' | 'one' | 'multiple';

export type ActionTriggerParameters = { clientId: string };

export type EntityActionFunction$None = (
  options: ActionTriggerParameters,
) => void;
export type EntityActionFunction$One = (
  entityId: string,
  options: ActionTriggerParameters,
) => void;
export type EntityActionFunction$Multiple = (
  entityIds: string[],
  options: ActionTriggerParameters,
) => void;

export type EntityActionFunction =
  | EntityActionFunction$None
  | EntityActionFunction$One
  | EntityActionFunction$Multiple;

export type EntityActionOptions = Partial<{}>;

export type EntityAction = [string, EntityActionFunction$One];
export type OneEntityAction = [
  string,
  { type: 'one' } & EntityActionOptions,
  EntityActionFunction$One,
];
export type NoneEntityAction = [
  string,
  { type: 'none' } & EntityActionOptions,
  EntityActionFunction$None,
];
export type MultipleEntityAction = [
  string,
  { type: 'multiple' } & EntityActionOptions,
  EntityActionFunction$Multiple,
];

export type ActionConstructors =
  | EntityAction
  | NoneEntityAction
  | OneEntityAction
  | MultipleEntityAction;
