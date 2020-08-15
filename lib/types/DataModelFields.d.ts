export declare type BaseDataModelFieldOptions = {};
export declare type TextFieldType = "text";
export declare type DataModelFieldOptions$TextFieldType = {
    type: TextFieldType;
} & BaseDataModelFieldOptions;
export declare type EmailFieldType = "email";
export declare type DataModelFieldOptions$EmailFieldType = {
    type: EmailFieldType;
} & BaseDataModelFieldOptions;
export declare type NumberFieldType = "number";
export declare type DataModelFieldOptions$NumberFieldType = {
    type: NumberFieldType;
} & BaseDataModelFieldOptions;
export declare type CustomFieldType = "custom";
export declare type DataModelFieldOptions$CustomFieldType = {
    type: CustomFieldType;
} & BaseDataModelFieldOptions;
export declare type BooleanFieldType = "boolean";
export declare type DataModelFieldOptions$BooleanFieldType = {
    type: BooleanFieldType;
} & BaseDataModelFieldOptions;
export declare type PasswordFieldType = "password";
export declare type DataModelFieldOptions$PasswordFieldType = {
    type: BooleanFieldType;
} & BaseDataModelFieldOptions;
export declare type DescriptionFieldType = "description";
export declare type DataModelFieldOptions$DescriptionFieldType = {
    type: BooleanFieldType;
};
export declare type DataModelFieldType = TextFieldType | EmailFieldType | NumberFieldType | CustomFieldType | BooleanFieldType | PasswordFieldType | DescriptionFieldType;
export declare type DataModelFieldOptionsType = DataModelFieldOptions$TextFieldType | DataModelFieldOptions$EmailFieldType | DataModelFieldOptions$NumberFieldType | DataModelFieldOptions$CustomFieldType | DataModelFieldOptions$BooleanFieldType | DataModelFieldOptions$PasswordFieldType | DataModelFieldOptions$DescriptionFieldType;
