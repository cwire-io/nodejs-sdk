import faker from 'faker';
import express from 'express';
import { CWire, DataModelAction, SequelizeDataModel } from '../../';
import { DataTypes, Model, Sequelize } from 'sequelize';

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

// PROD: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoidjEiLCJ0eXBlIjoiYXBpLWNsaWVudCIsInBheWxvYWQiOiI2MDA5YWYyODBlMzhlYzBjMjcyYWZhNGIiLCJpYXQiOjE2MTg3ODQwNjZ9.f_LnPpPYtBssBTbcYuEhFFC046ch4UEr1hYQVuHFZgQ
// LOCAL: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoidjEiLCJ0eXBlIjoiYXBpLWNsaWVudCIsInBheWxvYWQiOiI2MDdjOWI2YWI1MzA0MDkwZWEwOWM0ZmIiLCJpYXQiOjE2MTkxMTkzNDZ9.SS_N28pjF1TAqkXFARBb3lOcS2TRYlHIi-Ir1bGV8XE
(async () => {
  await CWire.init('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoidjEiLCJ0eXBlIjoiYXBpLWNsaWVudCIsInBheWxvYWQiOiI2MDA5YWYyODBlMzhlYzBjMjcyYWZhNGIiLCJpYXQiOjE2MTg3ODQwNjZ9.f_LnPpPYtBssBTbcYuEhFFC046ch4UEr1hYQVuHFZgQ', {
    models,
    // logger: "none",
    // apiURL: 'http://localhost:5000',
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
