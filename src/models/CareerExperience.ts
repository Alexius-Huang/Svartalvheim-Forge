import ApplicationModel from './ApplicationModel';

import {
  IntegerColumn,
  ModelSchema,
  Required,
  TextColumn,
  TimestampColumn,
  PrimaryColumn
} from '../utils/ModelDecorators';

@ModelSchema()
export default class CareerExperience extends ApplicationModel {
  @PrimaryColumn()
  id!: number;

  @TextColumn({ length: 255 })
  company!: string;

  @IntegerColumn({ required: true })
  startMonth!: number;

  @Required @IntegerColumn()
  startYear!: number;

  @IntegerColumn()
  endMonth?: number;

  @IntegerColumn()
  endYear?: number;

  @TextColumn({ length: 255 })
  position!: string;

  @TextColumn({ isArray: true, length: 255 })
  tags!: Array<string>;

  @TextColumn({ isArray: true })
  description!: Array<string>;

  @TimestampColumn()
  createdAt!: Date;

  @TimestampColumn()
  updatedAt!: Date;
}
