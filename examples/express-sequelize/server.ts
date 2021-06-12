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
  await CWire.init('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoidjEiLCJ0eXBlIjoiYXBpLWNsaWVudCIsInBheWxvYWQiOiI1ZmIyNzU1ZTQxM2MwYjYwY2Y1OGIxZjEiLCJpYXQiOjE2MDk1OTI3ODJ9.bf1MKiQ0lvcTy3PWUCNiNAU7YyXfSZe2j6sq4omDIEU', {
    models,
  });
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
