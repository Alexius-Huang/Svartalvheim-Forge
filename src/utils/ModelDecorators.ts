import { validateRequired } from './validations';
import camelToSnakeCase from './camelToSnakeCase';
import knex from './knex';

export interface ModelOptions {
  table?: string;
}

export enum DataType {
  Integer = 'Integer',
  Float = 'Float',
  Text = 'Text',
  Boolean = 'Boolean',
  Timestamp = 'Timestamp',
  Array = 'Array'
}

export interface ModelColumnOptions {
  name?: string;
  type?: DataType;
  isArray?: boolean;
  required?: boolean;
}

export interface TextColumnOptions extends ModelColumnOptions {
  length?: number;
}

export type ModelColumn = {
  mappedColumnName: string;
  type: DataType;
  isArray: boolean;
  required: boolean;
};
export type ModelColumns = Map<string, ModelColumn>;
export type ColumnValueType = string | number | boolean | Date | null;

function stringToTypeConversion(value: string, dataType: DataType) {
  switch (dataType) {
    case DataType.Integer:
      const intValue = Number.parseInt(value);
      return Number.isNaN(intValue) ? null : intValue;
    case DataType.Float:
      const floatValue = Number.parseFloat(value);
      return Number.isNaN(floatValue) ? null : floatValue;
    case DataType.Text:      return value ?? null;
    case DataType.Boolean:   return value === '1';
    case DataType.Timestamp: return new Date(value);
    default:
      throw new Error('Invalid data type conversion');
  }
}

export function ModelSchema(options?: ModelOptions): ClassDecorator {
  return function (constructor: Function) {
    const table = options?.table ?? camelToSnakeCase(constructor.name);
    Reflect.defineMetadata('model:table', table, constructor);

    const columns: ModelColumns = Reflect.getMetadata('model:columns', constructor);
    const primaryKey = Reflect.getMetadata('model:primary-column', constructor);

    Reflect.defineProperty(constructor.prototype, '_map_to_data_table', {
      get() {
        const data = (this as any)._formatted_data;
        const columnKeys = columns.keys();
        let columnKey = columnKeys.next();
        const result: Record<string, ColumnValueType> = {};
        while (!columnKey.done) {
          const { value: key } = columnKey;
          const { mappedColumnName } = columns.get(key) as ModelColumn;
          result[mappedColumnName] = data[key];
          columnKey = columnKeys.next();
        }

        result[primaryKey] = (this as any)[primaryKey] ?? null;

        return result;
      }
    });

    Reflect.defineProperty(constructor.prototype, '_formatted_data', {
      get() {
        const columnKeys = columns.keys();
        let columnKey = columnKeys.next();
        const result: Record<string, ColumnValueType> = {};
        while (!columnKey.done) {
          const { value: key } = columnKey;
          const { isArray, type: dataType } = columns.get(key) as ModelColumn;
          const value = (this as any)[key];
          if (isArray) {
            result[key] = JSON.parse(value);
          } else {
            result[key] = stringToTypeConversion(value, dataType);
          }

          columnKey = columnKeys.next();
        }

        result[primaryKey] = (this as any)[primaryKey] ?? null;
        return result;
      }
    });

    // this is service
    constructor.prototype.create = async function (data: Record<string, ColumnValueType>) {
      const columnKeys = columns.keys();
      let columnKey = columnKeys.next();

      while (!columnKey.done) {
        const { value: key } = columnKey;
        const { required, type } = columns.get(key) as ModelColumn;
        const value = data[key];
        
        // TODO: implement length check
        required && validateRequired(key, type, data[key]);

        this[key] = value;
        columnKey = columnKeys.next();
      }

      this.createdAt = new Date();
      this.updatedAt = new Date(this.createdAt);

      // this is repo
      const tableData = this._map_to_data_table;
      delete tableData.id;
      const [ id ] = await knex(table).insert(tableData).returning('id');
      this[primaryKey] = id;

      return this._formatted_data;
    }

    constructor.prototype.update = async function (id: number | string, data: Record<string, ColumnValueType>) {
      const columnKeys = columns.keys();
      let columnKey = columnKeys.next();

      const originCopy: { [key: string]: string } = await knex(table).select('*').where({ id }).first();

      while (!columnKey.done) {
        const { value: key } = columnKey;
        const { mappedColumnName } = columns.get(key) as ModelColumn;
        this[key] = data[key] || (originCopy as any)[mappedColumnName];
        columnKey = columnKeys.next();
      }

      this.createdAt = originCopy.created_at;
      this.updatedAt = new Date();

      // this is repo
      const tableData = this._map_to_data_table;
      delete tableData.id;
      await knex(table).where({ id }).update(tableData);

      this[primaryKey] = originCopy[primaryKey];
      return this._formatted_data;
    }
  }
}

function ModelColumn(options?: ModelColumnOptions): PropertyDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
  ) {
    const key = String(propertyKey);
    const type = options?.type ?? DataType.Text;
    const isArray = options?.isArray ?? false;
    const required = options?.required ?? false;

    const mappedColumnName = options?.name ?? camelToSnakeCase(key);
    const { constructor } = target;
    const columns: ModelColumns | undefined = Reflect.getMetadata('model:columns', constructor);

    const columnMetadata = {
      mappedColumnName,
      type,
      isArray,
      required
    };

    if (columns) {
      columns.set(key, columnMetadata);
    } else {
      Reflect.defineMetadata(
        'model:columns',
        new Map([[key, columnMetadata]]) as ModelColumns,
        constructor
      );  
    }
  }
}

export function IntegerColumn(options?: Omit<ModelColumnOptions, 'type'>) {
  return ModelColumn({ ...options, type: DataType.Integer });
}

export function FloatColumn(options?: Omit<ModelColumnOptions, 'type'>) {
  return ModelColumn({ ...options, type: DataType.Float });
}

export function TextColumn(options?: Omit<TextColumnOptions, 'type'>) {
  return ModelColumn({ ...options, type: DataType.Text });
}

export function BooleanColumn(options?: Omit<ModelColumnOptions, 'type'>) {
  return ModelColumn({ ...options, type: DataType.Boolean });
}

export function TimestampColumn(options?: Omit<ModelColumnOptions, 'type'>) {
  return ModelColumn({ ...options, type: DataType.Timestamp });
}

export function PrimaryColumn(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    Reflect.defineMetadata('model:primary-column', propertyKey, target.constructor);
  }
}

export function Required(target: any, propertyKey: string | symbol) {
  const key = String(propertyKey);
  const { constructor } = target;
  const columns: ModelColumns | undefined = Reflect.getMetadata('model:columns', constructor);
  const columnMetadata = columns?.get(key);
  if (columnMetadata) {
    columnMetadata.required = true;
  } else {
    throw new Error('Please put Required decorator before any Column decorator in order to enable this feature');
  }
}
