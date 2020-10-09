import express from 'express';
import {DataTypes, Model, Sequelize} from 'sequelize';
import {CWire, DataModel, DataModelField} from '../../';

const app = express();

const sequelize = new Sequelize('sqlite::memory');

class User extends Model {}

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
  }
}, {
  sequelize,
  modelName: 'User'
});
const models = [
  new DataModel('users', {
    model: User,
    type: "Sequelize"
  })
];

(async () => {
  await CWire.init(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoidjEiLCJ0eXBlIjoiYXBpLWNsaWVudCIsInBheWxvYWQiOiI1ZjdkZjI5N2VkNjVjNzFiZWRmNzYzYTQiLCJpYXQiOjE2MDIwODk2MjN9.xBkcWpUECB1NQ1bCrjvYGJ1pqp7MILZdbG-m7eyKMbU",
    { models, apiURL: 'http://localhost:5000' }
  );

  await sequelize.sync();
  await User.create({ firstName: 'Chris', lastName: 'CWire', email: 'chris@example.com' });
  await User.create({ firstName: 'Leon', lastName: 'CWire', email: 'leon@example.com' });
  await User.create({ firstName: 'Moritz', lastName: 'CWire', email: 'moritz@example.com' });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const port = process.env.PORT || 5050;
  app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`),
  );
})();
