import { EntityTarget } from 'typeorm';

export function BaseModel(baseModel: EntityTarget<any>) {
  return function (constructor: Function) {
    Reflect.defineMetadata('model', baseModel, constructor);
  }
}
