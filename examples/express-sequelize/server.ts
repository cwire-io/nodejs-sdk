import faker from 'faker';
import express from 'express';
import { DataTypes, Model, Sequelize } from 'sequelize';
import {CWire, Action, SequelizeDataModel, FrontendClient} from '../../';

const app = express();

const sequelize = new Sequelize('sqlite::memory', { logging: false });

class User extends Model {}
class Project extends Model {}
class Document extends Model {}

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
    modelName: 'Users',
  },
);
Project.init(
  {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  },
  {
    sequelize,
    modelName: 'Projects',
  },
);

Document.init(
  {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    content: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  },
  {
    sequelize,
    modelName: 'Document',
  },
);

Project.belongsTo(User, { foreignKey: 'fkUserId', as: 'User' });
User.hasMany(Project, { foreignKey: 'fkUserId', as: 'Settings' });

Document.belongsTo(User, { foreignKey: 'fkUserId', as: 'User' });
User.hasMany(Document, { foreignKey: 'fkUserId', as: 'Documents' });


const models = SequelizeDataModel.parse([User, Project, Document], { isEditable: true });

models[0].addAction(new Action('Open user blog', async (entityId, options) => {
  const { clientId } = options;
  await FrontendClient.openLink(clientId, 'https://dev.to');
}));


(async () => {
  await CWire.init('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoidjEiLCJ0eXBlIjoiYXBpLWNsaWVudCIsInBheWxvYWQiOiI2MWY4Njc5ZmZkNGIwNTY2NmIxMzU1MzYiLCJpYXQiOjE2NDM2Njk0MDd9.5egtPbQ73T_Nw_ByC-RH7ZVuGMwc52EBvmDM_hGSv6M', {
    models,
  });
  await sequelize.sync();
  const promises = [];

  for (let index = 0; index < 100; index++) {
    const user = await User.create({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
    });
    await Project.create({
      name: faker.company.companyName(),
      fkUserId: user.getDataValue('id')
    });
    await Document.create({
      name: faker.commerce.productName(),
      content: faker.commerce.productDescription(),
      fkUserId: user.getDataValue('id')
    });
    await Document.create({
      name: faker.commerce.productName(),
      content: faker.commerce.productDescription(),
      fkUserId: user.getDataValue('id')
    });
    await Document.create({
      name: faker.commerce.productName(),
      content: faker.commerce.productDescription(),
      fkUserId: user.getDataValue('id')
    });
  }

  await Promise.all(promises);


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const port = process.env.PORT || 5555;
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
})();
