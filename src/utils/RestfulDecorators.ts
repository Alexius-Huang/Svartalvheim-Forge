export enum HTTPActions {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  OPTION = 'OPTION',
  DELETE = 'DELETE'
};

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
