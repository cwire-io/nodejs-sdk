export declare type DataModelReferenceFieldType = {
    model: string;
    field: string;
    type: 'one' | 'many';
};
export declare type BaseDataModelFieldOptions = {
    modelId?: string;
    isUnique?: boolean;
    defaultValue?: any;
    isPrimary?: boolean;
    isRequired?: boolean;
    isNullable?: boolean;
    type: DataModelFieldType;
    reference?: DataModelReferenceFieldType;
};
export declare type TextFieldType = 'text';
export declare type DataModelFieldOptions$TextFieldType = {
    type: TextFieldType;
} & BaseDataModelFieldOptions;
export declare type NumberFieldType = 'number';
export declare type DataModelFieldOptions$NumberFieldType = {
    type: NumberFieldType;
} & BaseDataModelFieldOptions;
export declare type BooleanFieldType = 'boolean';
export declare type DataModelFieldOptions$BooleanFieldType = {
    type: BooleanFieldType;
} & BaseDataModelFieldOptions;
export declare type CustomFieldType = 'custom';
export declare type DataModelFieldOptions$CustomFieldType = {
    type: CustomFieldType;
} & BaseDataModelFieldOptions;
export declare type GenericDataModelFieldTypes = TextFieldType | NumberFieldType | CustomFieldType | BooleanFieldType;
export declare type GenericDataModelFieldOptionsTypes = DataModelFieldOptions$TextFieldType | DataModelFieldOptions$NumberFieldType | DataModelFieldOptions$BooleanFieldType | DataModelFieldOptions$CustomFieldType;
export declare type MongoDBObjectIdFieldType = 'objectId';
export declare type DataModelFieldOptions$MongoDBObjectIdFieldType = {
    type: MongoDBObjectIdFieldType;
} & BaseDataModelFieldOptions;
export declare type MongoDBDataModelFieldTypes = MongoDBObjectIdFieldType;
export declare type MongoDBDataModelFieldOptionsTypes = DataModelFieldOptions$MongoDBObjectIdFieldType;
export declare type EmailFieldType = 'email';
export declare type DataModelFieldOptions$EmailFieldType = {
    type: EmailFieldType;
} & BaseDataModelFieldOptions;
export declare type PasswordFieldType = 'password';
export declare type DataModelFieldOptions$PasswordFieldType = {
    type: PasswordFieldType;
} & BaseDataModelFieldOptions;
export declare type DescriptionFieldType = 'description';
export declare type DataModelFieldOptions$DescriptionFieldType = {
    type: DescriptionFieldType;
} & BaseDataModelFieldOptions;
export declare type UIDataModelFieldTypes = EmailFieldType | PasswordFieldType | DescriptionFieldType;
export declare type UIDataModelFieldOptionsTypes = DataModelFieldOptions$EmailFieldType | DataModelFieldOptions$PasswordFieldType | DataModelFieldOptions$DescriptionFieldType;
export declare type DateFieldType = 'date';
export declare type DataModelFieldOptions$DateFieldType = {
    type: DateFieldType;
} & BaseDataModelFieldOptions;
export declare type DateTimeFieldType = 'dateTime';
export declare type DataModelFieldOptions$DateTimeFieldType = {
    type: DateTimeFieldType;
} & BaseDataModelFieldOptions;
export declare type TimestampFieldType = 'timestamp';
export declare type DataModelFieldOptions$TimestampFieldType = {
    type: TimestampFieldType;
} & BaseDataModelFieldOptions;
export declare type TimeDataModelFieldTypes = DateFieldType | DateTimeFieldType | TimestampFieldType;
export declare type DateDataModelFieldOptionsTypes = DataModelFieldOptions$DateFieldType | DataModelFieldOptions$DateTimeFieldType | DataModelFieldOptions$TimestampFieldType;
export declare type DataModelFieldType = GenericDataModelFieldTypes | UIDataModelFieldTypes | TimeDataModelFieldTypes | MongoDBDataModelFieldTypes;
export declare type DataModelFieldOptionsType = UIDataModelFieldOptionsTypes | DateDataModelFieldOptionsTypes | GenericDataModelFieldOptionsTypes | MongoDBDataModelFieldOptionsTypes;
export declare type APIDataModelFieldReference = {
    model: string;
    field: string;
};
export declare type APIDataModelField = {
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
