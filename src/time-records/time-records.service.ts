import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TimeRecord } from './entities/time-record.entity';
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';
import { CreateTimeRecordDto } from './dto/create-time-record.dto';
import { UpdateTimeRecordDto } from './dto/update-time-record.dto';

@Injectable()
export class TimeRecordsService {
  constructor(
    @InjectRepository(TimeRecord)
    private timeRecordsRepository: Repository<TimeRecord>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(createTimeRecordDto: CreateTimeRecordDto, user: User): Promise<TimeRecord> {

    const company = await this.companiesRepository.findOne({
      where: { id: createTimeRecordDto.companyId },
      relations: ['users'],
    });

    if (!company) {
      throw new NotFoundException(`Empresa com ID ${createTimeRecordDto.companyId} não encontrada`);
    }

    const hasAccess = company.users.some(companyUser => companyUser.id === user.id);
    if (!hasAccess) {
      throw new ForbiddenException('Você não tem acesso a esta empresa');
    }


    const timeRecord = this.timeRecordsRepository.create({
      ...createTimeRecordDto,
      date: new Date(createTimeRecordDto.date),
      userId: user.id,
      user,
      company,
    });

    return this.timeRecordsRepository.save(timeRecord);
  }

  async findAll(user: User, companyId?: number, startDate?: Date, endDate?: Date): Promise<TimeRecord[]> {
    const queryBuilder = this.timeRecordsRepository.createQueryBuilder('timeRecord')
      .leftJoinAndSelect('timeRecord.company', 'company')
      .where('timeRecord.userId = :userId', { userId: user.id });

    if (companyId) {
      queryBuilder.andWhere('timeRecord.companyId = :companyId', { companyId });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere('timeRecord.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    return queryBuilder.orderBy('timeRecord.date', 'DESC').getMany();
  }

  async findOne(id: number, user: User): Promise<TimeRecord> {
    const timeRecord = await this.timeRecordsRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!timeRecord) {
      throw new NotFoundException(`Registro de ponto com ID ${id} não encontrado`);
    }


    if (timeRecord.userId !== user.id) {
      throw new ForbiddenException('Você não tem acesso a este registro de ponto');
    }

    return timeRecord;
  }

  async update(id: number, updateTimeRecordDto: UpdateTimeRecordDto, user: User): Promise<TimeRecord> {

    const timeRecord = await this.findOne(id, user);


    if (updateTimeRecordDto.companyId && updateTimeRecordDto.companyId !== timeRecord.companyId) {
      const company = await this.companiesRepository.findOne({
        where: { id: updateTimeRecordDto.companyId },
        relations: ['users'],
      });

      if (!company) {
        throw new NotFoundException(`Empresa com ID ${updateTimeRecordDto.companyId} não encontrada`);
      }

      const hasAccess = company.users.some(companyUser => companyUser.id === user.id);
      if (!hasAccess) {
        throw new ForbiddenException('Você não tem acesso a esta empresa');
      }

      timeRecord.company = company;
    }


    const updatedTimeRecord = {
      ...timeRecord,
      ...updateTimeRecordDto,
      date: updateTimeRecordDto.date ? new Date(updateTimeRecordDto.date) : timeRecord.date,
    };

    return this.timeRecordsRepository.save(updatedTimeRecord);
  }

  async remove(id: number, user: User): Promise<void> {

    await this.findOne(id, user);

    const result = await this.timeRecordsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Registro de ponto com ID ${id} não encontrado`);
    }
  }

  async findByDateRange(user: User, companyId: number, startDate: Date, endDate: Date): Promise<TimeRecord[]> {

    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
      relations: ['users'],
    });

    if (!company) {
      throw new NotFoundException(`Empresa com ID ${companyId} não encontrada`);
    }

    const hasAccess = company.users.some(companyUser => companyUser.id === user.id);
    if (!hasAccess) {
      throw new ForbiddenException('Você não tem acesso a esta empresa');
    }


    return this.timeRecordsRepository.find({
      where: {
        userId: user.id,
        companyId,
        date: Between(startDate, endDate),
      },
      order: {
        date: 'ASC',
      },
    });
  }
}
