import express from 'express';
import mongoose, { Schema } from 'mongoose';

import { MongoMemoryServer } from 'mongodb-memory-server';

import { CWire, MongooseDataModel } from '../../';

const app = express();
const mongod = new MongoMemoryServer();

(async () => {
  const uri = await mongod.getUri();

  const UserSchema = new Schema({
    email: String,
    lastName: String,
    firstName: {
      type: String,
      default: 'first',
    },
  });

  // tslint:disable-next-line:only-arrow-functions
  UserSchema.pre('updateOne', function (next) {
    console.log('updateOne');
    next();
  });

  const User = mongoose.model('User', UserSchema);

  const Settings = mongoose.model(
    'settings',
    new Schema({
      isAllowed: Boolean,
      // CWIRE detect references automatically
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
    }),
  );

  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const models = [new MongooseDataModel(User)];

  /* CWire set references manually
  models[1].getFieldByName('userId').setReference({
    // CWire model name
    model: 'users',
    // CWire model field name
    field: '_id',
  });
   */

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

  /*
  Testing for entity history logging
  await User.updateMany(
    { email: 'moritz@example.com' },
    { $set: { firstName: 'Christoph' } },
  );
  await User.updateOne(
    { email: 'leon@example.com' },
    { $set: { firstName: 'Tittler' } },
  );
  await User.update(
    { email: 'chris@example.com' },
    { $set: { firstName: 'Tittler' } },
  );
   */

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const port = process.env.PORT || 5051;
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
})();
