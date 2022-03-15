import { CWire } from '../../CWire';
import { DataModelQuery } from '../../types/DataModelQuery';
import { DataModelCalculationFunctions } from '../../types/DataModel';
import { DataModel, DataModelOptions } from '../../DataModel';
export declare const PrismaType = "Prisma";
export default class PrismaDataModel<Schema = any> extends DataModel<Schema> {
    private prisma;
    private model;
    protected static getPrismaSettings(prisma: any): any;
    constructor(model: any, prisma: any, options: DataModelOptions);
    static parse(prisma: any, options: Partial<{
        blacklist: string[];
        whitelist: string[];
    } & DataModelOptions>): any;
    constructReferences(cwire: CWire, nativeModels: Record<string, DataModel>): Promise<any>;
    getName(): string;
    getType(): string;
    getPrismaModelName(): string;
    count(cwire: CWire, query: DataModelQuery): Promise<any>;
    create(cwire: CWire, values: Schema): Promise<any>;
    findAll(cwire: CWire, query: DataModelQuery): Promise<any>;
    findOne(cwire: CWire, query: DataModelQuery): Promise<any>;
    remove(cwire: CWire, query: DataModelQuery): Promise<any>;
    update(cwire: CWire, query: DataModelQuery, changes: Schema): Promise<any>;
    calculate(cwire: CWire, calcFn: DataModelCalculationFunctions, fieldName: string, query: DataModelQuery): Promise<any>;
}
