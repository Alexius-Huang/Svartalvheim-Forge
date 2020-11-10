import 'reflect-metadata';
import App from './app';

import * as bodyParser from 'body-parser';
import loggerMiddleware from './middleware/logger';

import controllers from './controllers';

const app = new App({
  port: 5000,
  controllers,
  middleWares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    loggerMiddleware
  ]
});

app.listen();
