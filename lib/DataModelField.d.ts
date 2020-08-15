import { DataModelFieldOptionsType, DataModelFieldType } from "./types/DataModelFields";
export declare class DataModelField {
    private readonly name;
    private type;
    constructor(name: string, options: DataModelFieldOptionsType);
    getName(): string;
    getType(): string;
    toJSON(): {
        name: string;
        type: DataModelFieldType;
    };
    static isValidFieldType(type: any): boolean;
}
