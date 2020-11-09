import * as express from 'express';
import { Connection, createConnection } from 'typeorm';
import models from '../models';
import type ControllerBase from '../interfaces/ControllerBase';
import { HTTPActions, RouteMap } from '../utils/RestfulDecorators';

abstract class ApplicationController implements ControllerBase {
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    const routes: RouteMap = Reflect.getMetadata('routes', this.constructor);
    const baseURL: string = Reflect.getMetadata('base', this.constructor);

    routes.forEach(({ route, httpAction }, name: string) => {
      console.log(`${baseURL}${route}`);

      let httpMethod: string;
      switch (httpAction) {
        case HTTPActions.GET:    httpMethod = 'get';    break;
        case HTTPActions.POST:   httpMethod = 'post';   break;
        case HTTPActions.PUT:    httpMethod = 'put';    break;
        case HTTPActions.OPTION: httpMethod = 'option'; break;
        case HTTPActions.DELETE: httpMethod = 'delete'; break;
      }

      (this.router as any)[httpMethod](`${baseURL}${route}`, (this as any)[name]);
    });
  };

  protected async connect(callback: (connection: Connection) => void) {
    try {
      const conn = await createConnection({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number.parseInt(process.env.POSTGRES_PORT as string),
        database: process.env.POSTGRES_DATABASE,
        entities: models,
      });  

      callback(conn);
    } catch (err) {
      throw err;
    }
  } 

}

export default ApplicationController;
