import { DataModelFieldOptionsType, DataModelFieldType, DataModelReferenceFieldType } from './types/DataModelFields';
export declare class DataModelField {
    private readonly name;
    private type;
    private readonly isPrimary;
    private displayName;
    private reference;
    constructor(name: string, options: DataModelFieldOptionsType);
    getName(): string;
    getType(): DataModelFieldType;
    setDisplayName(displayName: string): void;
    setReference(reference: DataModelReferenceFieldType): void;
    getReference(): {
        type: "one" | "many";
        model: string;
        field: string;
    } | null;
    toJSON(): {
        displayName?: string;
        name: string;
        type: DataModelFieldType;
        reference: {
            type: "one" | "many";
            model: string;
            field: string;
        } | null;
        isPrimary: boolean;
    };
    isPrimaryField(): boolean;
    static isValidFieldReference(reference: any): any;
    static isValidFieldType(type: any): boolean;
}
