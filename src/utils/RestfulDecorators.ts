import { Request, Response } from "express";
import { EntityTarget } from "typeorm";
import knex from "./knex";

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

export function BaseURL(baseURL: string) {
  return function (constructor: Function) {
    Reflect.defineMetadata('base', baseURL, constructor);
  }
}

export function BaseModel(baseModel: EntityTarget<any>) {
  return function (constructor: Function) {
    Reflect.defineMetadata('model', baseModel, constructor);
  }
}

function requestDecoratorFactory(httpAction: HTTPActions) {
  return function (url?: string) {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const routes: RouteMap = Reflect.getMetadata('routes', target.constructor);
      const route = url || `/${propertyKey}`;
      if (routes) {
        routes.set(propertyKey, { httpAction, route});
      } else {
        Reflect.defineMetadata(
          'routes',
          new Map([[propertyKey, { httpAction, route }]]),
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
) {
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
              res.json({ status: 200, data });
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
            knex(tableName).select('*').where({ id: req.params.id }).then(data => {
              res.json({ status: 200, data });
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
