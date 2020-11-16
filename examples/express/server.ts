import express from 'express';
import {CWire, DataModel, DataModelField} from '../../';

const app = express();

const emailField = new DataModelField('email', { type: "text" });

const models = [
  new DataModel('users', {
    type: 'Custom',
    fields: [emailField],
    get: () => {
      return [{ email: 'christoph.abs@visit4.me' }, { email: 'christoph.abs@cwire.io' }];
    },
    actions: {
      delete: {
        type: "button",
        onTrigger: () => {
          console.log('delete button triggered');
        }
      }
    },
  })
];

(async () => {
  await CWire.init(
    "<YOUR_API_KEY>",
    { models }
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const port = process.env.PORT || 5050;
  app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`),
  );
})();
