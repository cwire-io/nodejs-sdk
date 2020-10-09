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
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoidjEiLCJ0eXBlIjoiYXBpLWNsaWVudCIsInBheWxvYWQiOiI1ZjRjZmM1YjU0ODdkMTFlMGNmNTdlOGQiLCJpYXQiOjE1OTg4ODA4NTl9.Mj4y_L1CjcgXY7N1HUfBoI3P2AYEvBSpVwRvifuUNAM",
    { models, apiURL: 'https://82c614be2aa7.ngrok.io' }
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const port = process.env.PORT || 5050;
  app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`),
  );
})();
