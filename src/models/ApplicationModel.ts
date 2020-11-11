import type { ColumnValueType } from '../utils/ModelDecorators';

export default class ApplicationModel {
  public create!: (data: Record<string, ColumnValueType>) => Promise<any>;
  public update!: (id: number | string, data: Record<string, ColumnValueType>) => Promise<any>;
  public createdAt!: Date;
  public updatedAt!: Date;
}
