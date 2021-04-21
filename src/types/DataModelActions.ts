export type BaseDataModelActionOptionsType = {
  onTrigger: () => void;
};

export type AlertActionType = 'alert';
export type DataModelActionOptions$AlertActionType = {
  type: AlertActionType;
} & BaseDataModelActionOptionsType;

export type ToggleActionType = 'toggle';
export type DataModelActionOptions$ToggleActionType = {
  type: ToggleActionType;
} & BaseDataModelActionOptionsType;

export type ButtonActionType = 'button';
export type DataModelActionOptions$ButtonActionType = {
  type: ButtonActionType;
} & BaseDataModelActionOptionsType;

export type DataModelActionType =
  | AlertActionType
  | ToggleActionType
  | ButtonActionType;
export type DataModelActionOptionsType =
  | DataModelActionOptions$AlertActionType
  | DataModelActionOptions$ToggleActionType
  | DataModelActionOptions$ButtonActionType;
