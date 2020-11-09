import * as express from 'express';
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

    console.log('Available Endpoints:');
    routes.forEach(({ route, httpAction }, name: string) => {
      console.log(`${httpAction.padStart(7)} :: ${baseURL}${route}`);

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
}

export default ApplicationController;
