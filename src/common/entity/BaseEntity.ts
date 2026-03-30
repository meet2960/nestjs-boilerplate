import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @Column({ type: 'integer', nullable: true })
  created_by!: number | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_date!: Date;

  @Column({ type: 'integer', nullable: true })
  modified_by!: number | null;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  modified_date!: Date | null;
}
