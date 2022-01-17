import { Model } from 'sequelize';
import SequelizeDataModel from './SequelizeDataModel';
export default abstract class CWireSequelizeModel extends Model {
    cwireDataModel: SequelizeDataModel;

    protected constructor(...props: any);

    on(type: string, eventOptions?: Partial<{
        after: any;
        before: any;
        icon: string;
        color: string;
        description: string;
    }>): Promise<void>;
    getCWireDataModel(): SequelizeDataModel<any>;
}
