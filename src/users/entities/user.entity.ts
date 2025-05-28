import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { TimeRecord } from '../../time-records/entities/time-record.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Company, company => company.users)
  companies: Company[];

  @OneToMany(() => TimeRecord, timeRecord => timeRecord.user)
  timeRecords: TimeRecord[];
}
