import faker from 'faker';
import express from 'express';
import { DataTypes, Model, Sequelize } from 'sequelize';
import {CWire, Action, SequelizeDataModel, FrontendClient} from '../../';

const app = express();

const sequelize = new Sequelize('sqlite::memory', { logging: false });

class User extends Model {}
class Setting extends Model {}
User.init(
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'T_USERS',
  },
);
Setting.init(
  {
    isAllowed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'T_SETTINGS',
  },
);

Setting.belongsTo(User, { foreignKey: 'fkUserId', as: 'Users' });
User.hasOne(Setting, { foreignKey: 'fkUserId', as: 'Settings' });

const models = SequelizeDataModel.parse([User, Setting], { isEditable: true });

models[0].addAction(new Action('Open Google', async (entityId, options) => {
  const { clientId } = options;
  await FrontendClient.openLink(clientId, 'https://google.com');
}));


(async () => {
  await CWire.init('<API_KEY>', {
    models,
  });
  await sequelize.sync();
  const promises = [];

  for (let index = 0; index < 5000; index++) {

    promises.push(User.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
    }));
  }

  await Promise.all(promises);


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const port = process.env.PORT || 5555;
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
})();
