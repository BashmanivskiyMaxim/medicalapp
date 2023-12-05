import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MedicalProcedureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  procedureType: string;

  @Column()
  description: string;
}
