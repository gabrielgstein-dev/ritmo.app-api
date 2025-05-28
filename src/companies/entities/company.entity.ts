import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TimeRecord } from '../../time-records/entities/time-record.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  cnpj: string;

  @Column({ default: 8 })
  workHours: number;

  @Column({ default: 1 })
  lunchBreak: number;

  @ManyToMany(() => User, user => user.companies)
  @JoinTable()
  users: User[];

  @OneToMany(() => TimeRecord, timeRecord => timeRecord.company)
  timeRecords: TimeRecord[];
}
