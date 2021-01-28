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
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const models = [
    new DataModel('users', {
      model: User,
      type: 'Mongoose',
    }),
  ];

  await CWire.init(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoidjEiLCJ0eXBlIjoiYXBpLWNsaWVudCIsInBheWxvYWQiOiI2MDEwNDdkYjA0NjE1OTFiNjMwYTQxYTciLCJpYXQiOjE2MTE2Nzk3MDd9.aj5JxzSY0h_mgrUMWJ91Zu2o4Lz8guXtzFkJbPoUroo',
    { models, apiURL: 'http://localhost:5000' },
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
