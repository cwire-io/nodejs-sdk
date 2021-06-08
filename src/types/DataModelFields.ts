export type DataModelReferenceFieldType = {
  model: string;
  field: string;
  type: 'one' | 'many';
};
export type BaseDataModelFieldOptions = {
  modelId?: string;
  isUnique?: boolean;
  defaultValue?: any;
  isPrimary?: boolean;
  isRequired?: boolean;
  isNullable?: boolean;
  type: DataModelFieldType;
  reference?: DataModelReferenceFieldType;
};

// GENERIC
export type TextFieldType = 'text';
export type DataModelFieldOptions$TextFieldType = {
  type: TextFieldType;
} & BaseDataModelFieldOptions;

export type NumberFieldType = 'number';
export type DataModelFieldOptions$NumberFieldType = {
  type: NumberFieldType;
} & BaseDataModelFieldOptions;

export type BooleanFieldType = 'boolean';
export type DataModelFieldOptions$BooleanFieldType = {
  type: BooleanFieldType;
} & BaseDataModelFieldOptions;

export type CustomFieldType = 'custom';
export type DataModelFieldOptions$CustomFieldType = {
  type: CustomFieldType;
} & BaseDataModelFieldOptions;

export type GenericDataModelFieldTypes =
  | TextFieldType
  | NumberFieldType
  | CustomFieldType
  | BooleanFieldType;
export type GenericDataModelFieldOptionsTypes =
  | DataModelFieldOptions$TextFieldType
  | DataModelFieldOptions$NumberFieldType
  | DataModelFieldOptions$BooleanFieldType
  | DataModelFieldOptions$CustomFieldType;

// UI
export type EmailFieldType = 'email';
export type DataModelFieldOptions$EmailFieldType = {
  type: EmailFieldType;
} & BaseDataModelFieldOptions;

export type PasswordFieldType = 'password';
export type DataModelFieldOptions$PasswordFieldType = {
  type: PasswordFieldType;
} & BaseDataModelFieldOptions;

export type DescriptionFieldType = 'description';
export type DataModelFieldOptions$DescriptionFieldType = {
  type: DescriptionFieldType;
} & BaseDataModelFieldOptions;

export type UIDataModelFieldTypes =
  | EmailFieldType
  | PasswordFieldType
  | DescriptionFieldType;
export type UIDataModelFieldOptionsTypes =
  | DataModelFieldOptions$EmailFieldType
  | DataModelFieldOptions$PasswordFieldType
  | DataModelFieldOptions$DescriptionFieldType;

// TIME
export type DateFieldType = 'date';
export type DataModelFieldOptions$DateFieldType = {
  type: DateFieldType;
} & BaseDataModelFieldOptions;

export type DateTimeFieldType = 'dateTime';
export type DataModelFieldOptions$DateTimeFieldType = {
  type: DateTimeFieldType;
} & BaseDataModelFieldOptions;

export type TimestampFieldType = 'timestamp';
export type DataModelFieldOptions$TimestampFieldType = {
  type: TimestampFieldType;
} & BaseDataModelFieldOptions;

export type TimeDataModelFieldTypes =
  | DateFieldType
  | DateTimeFieldType
  | TimestampFieldType;
export type DateDataModelFieldOptionsTypes =
  | DataModelFieldOptions$DateFieldType
  | DataModelFieldOptions$DateTimeFieldType
  | DataModelFieldOptions$TimestampFieldType;

export type DataModelFieldType =
  | GenericDataModelFieldTypes
  | UIDataModelFieldTypes
  | TimeDataModelFieldTypes;
export type DataModelFieldOptionsType =
  | UIDataModelFieldOptionsTypes
  | DateDataModelFieldOptionsTypes
  | GenericDataModelFieldOptionsTypes;

export type APIDataModelFieldReference = {
  model: string;
  field: string;
};
export type APIDataModelField = {
  id: string;
  name: string;
  isUnique: boolean;
  isPrimary: boolean;
  type: DataModelFieldType;
  isNullable: boolean;
  isRequired: boolean;
  reference: null | APIDataModelFieldReference;
  defaultValue: null | string | number | boolean;
};
