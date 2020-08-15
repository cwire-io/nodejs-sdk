export declare type BaseDataModelActionOptionsType = {
    onTrigger: () => void;
};
export declare type AlertActionType = "alert";
export declare type DataModelActionOptions$AlertActionType = {
    type: AlertActionType;
} & BaseDataModelActionOptionsType;
export declare type ToggleActionType = "toggle";
export declare type DataModelActionOptions$ToggleActionType = {
    type: ToggleActionType;
} & BaseDataModelActionOptionsType;
export declare type ButtonActionType = "button";
export declare type DataModelActionOptions$ButtonActionType = {
    type: ButtonActionType;
} & BaseDataModelActionOptionsType;
export declare type DataModelActionType = AlertActionType | ToggleActionType | ButtonActionType;
export declare type DataModelActionOptionsType = DataModelActionOptions$AlertActionType | DataModelActionOptions$ToggleActionType | DataModelActionOptions$ButtonActionType;
