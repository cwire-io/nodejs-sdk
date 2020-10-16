import { DataType, Model } from "sequelize";
import { DataModelField, DataModelFieldType } from "..";
export declare function parseSequelizeDataTypeToCWireDataType(dataType: DataType): DataModelFieldType;
export declare function buildEntitiesResponse(fields: DataModelField[], entities: Model<any, any>[]): any;
