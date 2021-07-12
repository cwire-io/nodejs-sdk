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
    // Model attributes are defined here
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

models[0].addAction(new Action('Login', async (entityId, options) => {
  const { clientId } = options;
  await FrontendClient.openLink(clientId, 'https://google.com');
}));


// PROD: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoidjEiLCJ0eXBlIjoiYXBpLWNsaWVudCIsInBheWxvYWQiOiI2MGQzNjI1MmE0ZmIzMTE4ODBlNTI5NjIiLCJpYXQiOjE2MjQ0NjYwMDJ9.jyrrcZXOLjk0zPba15U58_IhWWbPSM7q_bnV1Ia9J34
// LOCAL: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoidjEiLCJ0eXBlIjoiYXBpLWNsaWVudCIsInBheWxvYWQiOiI2MDdjOWI2YWI1MzA0MDkwZWEwOWM0ZmIiLCJpYXQiOjE2MTkxMTkzNDZ9.SS_N28pjF1TAqkXFARBb3lOcS2TRYlHIi-Ir1bGV8XE
(async () => {
  await CWire.init('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoidjEiLCJ0eXBlIjoiYXBpLWNsaWVudCIsInBheWxvYWQiOiI2MDdjOWI2YWI1MzA0MDkwZWEwOWM0ZmIiLCJpYXQiOjE2MjYxMjQ4OTV9.TR3rf1EqVlXfSnCO8zEnYdIh_JuyPbVJyzImvbbEt-U', {
    models,
    // logger: "none",
    apiURL: 'http://localhost:5000',
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
  const port = process.env.PORT || 5050;
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
})();
