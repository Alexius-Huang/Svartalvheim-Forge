import 'reflect-metadata';
import App from './app';

import cors from 'cors';
import * as bodyParser from 'body-parser';
import loggerMiddleware from './middleware/logger';

import controllers from './controllers';
import dotenv from 'dotenv';

dotenv.config();

const app = new App({
  port: 5000,
  controllers,
  middleWares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    loggerMiddleware,
    cors({
      origin: process.env.CORS_ORIGIN,
      optionsSuccessStatus: 200
    }),
  ]
});

app.listen();
