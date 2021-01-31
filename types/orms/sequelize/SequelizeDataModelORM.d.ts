import { DataModelORM } from '../../DataModelORM';
import SequelizeDataModel, { SequelizeModel } from './SequelizeDataModel';
export default class SequelizeDataModelORM extends DataModelORM {
    model: SequelizeModel;
    dataModel: SequelizeDataModel;
    constructor(model: SequelizeModel, dataModel: SequelizeDataModel);
}
