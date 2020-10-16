import { DataModelFieldOptionsType, DataModelFieldType } from "./types/DataModelFields";
export declare class DataModelField {
    private readonly name;
    private readonly isPrimary;
    private readonly type;
    constructor(name: string, options: DataModelFieldOptionsType);
    getName(): string;
    getType(): string;
    toJSON(): {
        name: string;
        type: DataModelFieldType;
    };
    isPrimaryField(): boolean;
    static isValidFieldType(type: any): boolean;
}
