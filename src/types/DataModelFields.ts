export type BaseDataModelFieldOptions = {};

export type TextFieldType = "text";
export type DataModelFieldOptions$TextFieldType = {
  type: TextFieldType;
} & BaseDataModelFieldOptions;

export type EmailFieldType = "email";
export type DataModelFieldOptions$EmailFieldType = {
  type: EmailFieldType;
} & BaseDataModelFieldOptions;

export type NumberFieldType = "number";
export type DataModelFieldOptions$NumberFieldType = {
  type: NumberFieldType;
} & BaseDataModelFieldOptions;

export type CustomFieldType = "custom";
export type DataModelFieldOptions$CustomFieldType = {
  type: CustomFieldType;
} & BaseDataModelFieldOptions;

export type BooleanFieldType = "boolean";
export type DataModelFieldOptions$BooleanFieldType = {
  type: BooleanFieldType;
} & BaseDataModelFieldOptions;

export type PasswordFieldType = "password";
export type DataModelFieldOptions$PasswordFieldType = {
  type: PasswordFieldType;
} & BaseDataModelFieldOptions;

export type DescriptionFieldType = "description";
export type DataModelFieldOptions$DescriptionFieldType = {
  type: DescriptionFieldType;
};
export type DataModelFieldType =
  | TextFieldType
  | EmailFieldType
  | NumberFieldType
  | CustomFieldType
  | BooleanFieldType
  | PasswordFieldType
  | DescriptionFieldType;
export type DataModelFieldOptionsType =
  | DataModelFieldOptions$TextFieldType
  | DataModelFieldOptions$EmailFieldType
  | DataModelFieldOptions$NumberFieldType
  | DataModelFieldOptions$CustomFieldType
  | DataModelFieldOptions$BooleanFieldType
  | DataModelFieldOptions$PasswordFieldType
  | DataModelFieldOptions$DescriptionFieldType;
