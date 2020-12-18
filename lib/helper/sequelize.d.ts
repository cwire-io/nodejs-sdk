import { DataModelField, DataModelFieldType } from "..";
import { DataModelQuery } from "../types/DataModelQuery";
import { DataType, Model } from "sequelize";
export declare function parseDataModelQueryToSequelizeQuery(query: any | DataModelQuery): any;
export declare function parseSequelizeDataTypeToCWireDataType(dataType: DataType): DataModelFieldType;
export declare function buildEntitiesResponse(fields: DataModelField[], entities: Model<any, any>[]): any;
