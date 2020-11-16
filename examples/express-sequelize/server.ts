import express from 'express';
import {DataTypes, Model, Sequelize} from 'sequelize';
import {CWire, DataModel, DataModelField} from '../../';

const app = express();

const sequelize = new Sequelize('sqlite::memory');

class User extends Model {}
class Setting extends Model {}

User.init({
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING
  },
}, {
  sequelize,
  modelName: 'User'
});
Setting.init({
  isAllowed: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'Setting'
});
const models = [
  new DataModel('users', {
    model: User,
    type: "Sequelize"
  }),
  new DataModel('settings', {
    model: Setting,
    type: "Sequelize"
  })
];

(async () => {
  await CWire.init(
    "<YOUR_API_KEY>",
    { models }
  );

  await sequelize.sync();
  await User.create({ firstName: 'Chris', lastName: 'CWire', email: 'chris@example.com' });
  await User.create({ firstName: 'Leon', lastName: 'CWire', email: 'leon@example.com' });
  await User.create({ firstName: 'Moritz', lastName: 'CWire', email: 'moritz@example.com' });

  for (let index = 1; index <= 400; index++) {
    await Setting.create({ isAllowed: index % 2 === 0 })
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const port = process.env.PORT || 5050;
  app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`),
  );
})();
