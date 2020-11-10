export function ModelTable(table: string) {
  return function (constructor: Function) {
    Reflect.defineMetadata('model:table', table, constructor);        
  }
}
