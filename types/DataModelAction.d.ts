import { DataModelActionOptionsType, DataModelActionType } from './types/DataModelActions';
export declare class DataModelAction {
    private name;
    private type;
    constructor(name: string, options: DataModelActionOptionsType);
    getName(): string;
    getType(): string;
    toJSON(): {
        name: string;
        type: DataModelActionType;
    };
    static isValidActionType(type: any): boolean;
}
