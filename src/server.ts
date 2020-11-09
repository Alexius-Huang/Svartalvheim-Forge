import 'reflect-metadata';
import dotenv from 'dotenv';
import App from './app';

import * as bodyParser from 'body-parser';
import loggerMiddleware from './middleware/logger';

import controllers from './controllers';

// Load environment variables from .env file
dotenv.config();

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
