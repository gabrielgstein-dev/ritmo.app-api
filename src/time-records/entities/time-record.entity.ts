import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity()
export class TimeRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  entryTime: string;

  @Column()
  lunchTime: string;

  @Column()
  returnTime: string;

  @Column()
  exitTime: string;

  @Column({ nullable: true })
  returnToWorkTime: string;

  @Column({ nullable: true })
  finalExitTime: string;

  @ManyToOne(() => User, user => user.timeRecords)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Company, company => company.timeRecords)
  company: Company;

  @Column()
  companyId: number;
}
