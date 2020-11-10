import { Request, Response } from "express";
import { useRepository } from "./useRepository";

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
    const target = constructor.prototype;

    if (actions.includes(CRUD.READ)) {
      /* Define Get all entities route */
      Reflect.defineProperty(target, 'all', {
        get() {
          return function (req: Request, res: Response) {
            useRepository(baseModel, async (repo) => {
              const result = await repo.find();
              return res.json({ status: 200, data: result });
            }).catch(error => res.json(error));
          }
        },
        enumerable: true
      });

      const allEntityRouteDescriptor = Object.getOwnPropertyDescriptor(target, 'all') as PropertyDescriptor;
      GET('/')(target, 'all', allEntityRouteDescriptor);

      /* Define Get single entity route */
      Reflect.defineProperty(target, 'one', {
        get() {
          return function (req: Request, res: Response) {
            useRepository(baseModel, async (repo) => {
              const result = await repo.findOne(req.params.id);
              return res.json({ status: 200, data: result });
            }).catch(error => res.json(error));
          }
        },
        enumerable: true
      });

      const oneEntityRouteDescriptor = Object.getOwnPropertyDescriptor(target, 'one') as PropertyDescriptor;
      GET('/:id')(target, 'one', oneEntityRouteDescriptor);
    }

    if (actions.includes(CRUD.DELETE)) {
      /* Define Delete single entry route */
      Reflect.defineProperty(target, 'delete', {
        get() {
          return function (req: Request, res: Response) {
            useRepository(baseModel, async (repo) => {
              const careerExperience = await repo.findOne(req.params.id);

              if (!careerExperience) {
                res.json({ status: 404, message: `\`CareerExperience\` data with id: ${req.params.id} not exist` });
              }

              await repo.remove(careerExperience);
              return res.json({ status: 200, message: 'Removed' });
            }).catch(error => res.json(error));
          }
        },
        enumerable: true
      });

      const allEntityRouteDescriptor = Object.getOwnPropertyDescriptor(target, 'delete') as PropertyDescriptor;
      DELETE('/:id')(target, 'delete', allEntityRouteDescriptor);
    }
  }
}
