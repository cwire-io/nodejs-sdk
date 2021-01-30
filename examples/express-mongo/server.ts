import express from 'express';
import mongoose, { Schema } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { CWire, MongooseDataModel } from '../../';

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

  const models = [new MongooseDataModel(User), new MongooseDataModel(Settings)];

  /* CWire set references manually
  models[1].getFieldByName('userId').setReference({
    // CWire model name
    model: 'users',
    // CWire model field name
    field: '_id',
  });
   */

  await CWire.init(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoidjEiLCJ0eXBlIjoiYXBpLWNsaWVudCIsInBheWxvYWQiOiI2MDEwNDdkYjA0NjE1OTFiNjMwYTQxYTciLCJpYXQiOjE2MTE5MzY4NDF9.Rq_AV8soMmDLU_7gge48cCeJ9ZH2wqJ-XzqCwhmLGWY',
    {
      models,
      apiURL: 'http://localhost:5000',
    },
  );

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
