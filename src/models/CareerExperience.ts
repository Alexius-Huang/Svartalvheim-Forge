import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import type ModelBase from '../interfaces/ModelBase';
import { ModelTable } from '../utils/ModelDecorators';

@Entity()
@ModelTable('career_experience')
export default class CareerExperience implements ModelBase {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  company!: string;

  @Column({ name: 'start_month' })
  startMonth!: number;

  @Column({ name: 'start_year' })
  startYear!: number;

  @Column({ name: 'end_month', nullable: true })
  endMonth?: number;

  @Column({ name: 'end_year', nullable: true })
  endYear?: number;

  @Column({ length: 255 })
  position!: string;

  @Column({ type: 'varchar', length: 255, array: true })
  tags!: Array<string>;

  @Column({ type: 'text', array: true })
  description!: Array<string>;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
