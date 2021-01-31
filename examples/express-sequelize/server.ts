import express from 'express';
import { CWire, SequelizeDataModel } from '../../';
import { DataTypes, Model, Sequelize } from 'sequelize';

const app = express();

const sequelize = new Sequelize('sqlite::memory');

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

const models = [new SequelizeDataModel(User), new SequelizeDataModel(Setting)];

(async () => {
  await CWire.init(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoidjEiLCJ0eXBlIjoiYXBpLWNsaWVudCIsInBheWxvYWQiOiI2MDEwNDdkYjA0NjE1OTFiNjMwYTQxYTciLCJpYXQiOjE2MTE5MzY4NDF9.Rq_AV8soMmDLU_7gge48cCeJ9ZH2wqJ-XzqCwhmLGWY',
    {
      models,
      apiURL: 'http://localhost:5000',
    },
  );
  await sequelize.sync();

  const chris = await User.create({
    firstName: 'Chris',
    lastName: 'CWire',
    email: 'chris@example.com',
  });
  await Setting.create({
    isAllowed: true,
    fkUserId: chris.getDataValue('id'),
  });
  await User.create({
    firstName: 'Leon',
    lastName: 'CWire',
    email: 'leon@example.com',
  });
  await User.create({
    firstName: 'Moritz',
    lastName: 'CWire',
    email: 'moritz@example.com',
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const port = process.env.PORT || 5050;
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
})();
