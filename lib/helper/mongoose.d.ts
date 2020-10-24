import { DataModelField, DataModelFieldType } from "..";
import { DataModelQuery } from "../types/DataModelQuery";
export declare function parseMongooseSchemaToCWireDataType(obj: any): DataModelFieldType | null;
export declare function parseDataModelQueryToMongooseQuery(query: DataModelQuery): any;
export declare function buildMongooseEntitiesResponse(fields: DataModelField[], entities: any): any;
