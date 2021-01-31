import { DataType, Model } from 'sequelize';
import { DataModelQuery } from '../../types/DataModelQuery';
import { CWire, DataModelField, DataModelFieldType } from '../..';
import SequelizeDataModel from './SequelizeDataModel';
export declare function parseSequelizeIncludingParsing(cwire: CWire, baseModel: SequelizeDataModel, query: DataModelQuery, sequelizeQuery: any): {
    sequelizeQuery: any;
    parsedIncludes: {
        [reference: string]: {
            model: SequelizeDataModel;
            key: string;
        };
    };
};
export declare function parseDataModelQueryToSequelizeQuery(query: any | DataModelQuery): any;
export declare function parseSequelizeDataTypeToCWireDataType(dataType: DataType): DataModelFieldType;
export declare function buildEntitiesResponse(fields: DataModelField[], entities: Model<any, any>[]): any;
