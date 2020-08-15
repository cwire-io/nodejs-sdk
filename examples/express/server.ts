import express from 'express';
import {CWire, DataModel, DataModelField} from '../../';

const app = express();

const emailField = new DataModelField('email', { type: "text" });

const models = [
  new DataModel('users', {
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
    "API-KEY",
    { models }
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const port = process.env.PORT || 8080;
  app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`),
  );
})();
