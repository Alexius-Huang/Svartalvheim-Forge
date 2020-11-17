import { Request, Response } from 'express';
import knex from './knex';
import CareerExperience from '../models/CareerExperience';
import snakeKeysToCamelCase from '../utils/snakeKeysToCamelCase';

export enum HTTPActions {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  OPTION = 'OPTION',
  DELETE = 'DELETE'
};

export enum CRUD {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

export type RouteMap = Map<string, { httpAction: HTTPActions; route: string }>;

export function BaseURL(baseURL: string): ClassDecorator {
  return function (constructor: Function) {
    Reflect.defineMetadata('base', baseURL, constructor);
  }
}

export function BaseModel(baseModel: Function): ClassDecorator {
  return function (constructor: Function) {
    Reflect.defineMetadata('model', baseModel, constructor);
  }
}

function requestDecoratorFactory(httpAction: HTTPActions) {
  return function (url?: string): MethodDecorator {
    return function (
      target: any,
      propertyKey: string | symbol,
      descriptor: PropertyDescriptor
    ) {
      const key = String(propertyKey);
      const routes: RouteMap = Reflect.getMetadata('routes', target.constructor);
      const route = url ?? `/${key}`; 

      if (routes) {
        routes.set(key, { httpAction, route});
      } else {
        Reflect.defineMetadata(
          'routes',
          new Map([[key, { httpAction, route }]]),
          target.constructor
        );
      }
    }
  }
}

export const GET = requestDecoratorFactory(HTTPActions.GET);
export const POST = requestDecoratorFactory(HTTPActions.POST);
export const PUT = requestDecoratorFactory(HTTPActions.PUT);
export const OPTION = requestDecoratorFactory(HTTPActions.OPTION);
export const DELETE = requestDecoratorFactory(HTTPActions.DELETE);

export function Restful(
  actions: Array<CRUD> = [CRUD.CREATE, CRUD.READ, CRUD.UPDATE, CRUD.DELETE]
): ClassDecorator {
  return function (constructor: Function) {
    const baseModel = Reflect.getMetadata('model', constructor);
    const tableName = Reflect.getMetadata('model:table', baseModel);
    const target = constructor.prototype;

    if (actions.includes(CRUD.READ)) {
      /* Define Get all entities route */
      Reflect.defineProperty(target, 'read:all', {
        get() {
          return function (req: Request, res: Response) {
            knex(tableName).select('*').then(data => {
              res.json({ status: 200, data: data.map(snakeKeysToCamelCase) });
            }).catch(err => {
              res.json(err);
            });
          }
        },
        enumerable: true
      });

      const allEntityRouteDescriptor = Object.getOwnPropertyDescriptor(target, 'read:all') as PropertyDescriptor;
      GET('/')(target, 'read:all', allEntityRouteDescriptor);

      /* Define Get single entity route */
      Reflect.defineProperty(target, 'read:single', {
        get() {
          return function (req: Request, res: Response) {
            knex(tableName).select('*').where({ id: req.params.id }).first().then(data => {
              res.json({ status: 200, data: snakeKeysToCamelCase(data) });
            }).catch(err => {
              res.json(err);
            });
          }
        },
        enumerable: true
      });

      const oneEntityRouteDescriptor = Object.getOwnPropertyDescriptor(target, 'read:single') as PropertyDescriptor;
      GET('/:id')(target, 'read:single', oneEntityRouteDescriptor);
    }

    if (actions.includes(CRUD.CREATE)) {
      /* Define Create single entry route */
      Reflect.defineProperty(target, 'create', {
        get() {
          return function (req: Request, res: Response) {
            const careerExperience = new CareerExperience();
            const { body } = req;
            careerExperience.create(body).then(data => {
              res.json({ status: 200, data: snakeKeysToCamelCase(data) });
            }).catch(error => console.log(error));
          }
        },
        enumerable: true
      });

      const allEntityRouteDescriptor = Object.getOwnPropertyDescriptor(target, 'create') as PropertyDescriptor;
      POST('/')(target, 'create', allEntityRouteDescriptor);
    }

    if (actions.includes(CRUD.UPDATE)) {
      /* Define Update single entry route */
      Reflect.defineProperty(target, 'update', {
        get() {
          return function (req: Request, res: Response) {
            const careerExperience = new CareerExperience();
            const { body } = req;
            careerExperience.update(req.params.id, body).then(data => {
              res.json({ status: 200, data: snakeKeysToCamelCase(data) });
            }).catch(error => console.log(error));
          }
        },
        enumerable: true
      });

      const allEntityRouteDescriptor = Object.getOwnPropertyDescriptor(target, 'update') as PropertyDescriptor;
      PUT('/:id')(target, 'update', allEntityRouteDescriptor);
    }

    if (actions.includes(CRUD.DELETE)) {
      /* Define Delete single entry route */
      Reflect.defineProperty(target, 'delete', {
        get() {
          return function (req: Request, res: Response) {
            knex(tableName).select('*').where({ id: req.params.id }).del().then(() => {
              res.json({ status: 200 });
            }).catch(err => {
              res.json(err);
            });
          }
        },
        enumerable: true
      });

      const allEntityRouteDescriptor = Object.getOwnPropertyDescriptor(target, 'delete') as PropertyDescriptor;
      DELETE('/:id')(target, 'delete', allEntityRouteDescriptor);
    }
  }
}
