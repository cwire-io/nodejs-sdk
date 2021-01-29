import express from 'express';
import mongoose, { Schema } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { CWire, DataModel } from '../../';

const app = express();
const mongod = new MongoMemoryServer();

(async () => {
  const uri = await mongod.getUri();
  const User = mongoose.model(
    'User',
    new Schema({
      email: String,
      lastName: String,
      firstName: {
        type: String,
        default: 'first',
      },
    }),
  );

  const Settings = mongoose.model(
    'settings',
    new Schema({
      isAllowed: Boolean,
      // CWIRE detect references automatically
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
    }),
  );

  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const models = [
    new DataModel('users', {
      model: User,
      type: 'Mongoose',
    }),
    new DataModel('settings', {
      model: Settings,
      type: 'Mongoose',
    }),
  ];

  // CWire set references manually
  models[1].getFieldByName('userId').setReference({
    // CWire model name
    model: 'users',
    // CWire model field name
    field: '_id',
  });

  await CWire.init('<YOUR_API_KEY>', {
    models,
  });

  await User.create({
    firstName: 'Chris',
    lastName: 'CWire',
    email: 'chris@example.com',
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
  const port = process.env.PORT || 5051;
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
})();
