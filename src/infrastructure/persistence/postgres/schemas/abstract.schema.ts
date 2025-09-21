import {
  CreateDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class AbstractSchema {
  @PrimaryColumn('uuid')
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn({ name: 'inserted_at' })
  insertedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
