import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { User } from '../users/entities/user.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, user: User): Promise<Company> {
    const company = this.companiesRepository.create({
      ...createCompanyDto,
      users: [user],
    });

    return this.companiesRepository.save(company);
  }

  async findAllByUser(user: User): Promise<Company[]> {
    const userWithCompanies = await this.usersRepository.findOne({
      where: { id: user.id },
      relations: ['companies'],
    });

    return userWithCompanies.companies;
  }

  async findOne(id: number, user: User): Promise<Company> {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!company) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }


    const hasAccess = company.users.some(companyUser => companyUser.id === user.id);
    if (!hasAccess) {
      throw new ForbiddenException('Você não tem acesso a esta empresa');
    }

    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto, user: User): Promise<Company> {

    const company = await this.findOne(id, user);
    

    const updatedCompany = { ...company, ...updateCompanyDto };
    return this.companiesRepository.save(updatedCompany);
  }

  async remove(id: number, user: User): Promise<void> {

    await this.findOne(id, user);
    
    const result = await this.companiesRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }
  }

  async addUserToCompany(companyId: number, userId: number, currentUser: User): Promise<Company> {

    const company = await this.findOne(companyId, currentUser);
    

    const userToAdd = await this.usersRepository.findOne({ where: { id: userId } });
    if (!userToAdd) {
      throw new NotFoundException(`Usuário com ID ${userId} não encontrado`);
    }
    

    const isUserAlreadyInCompany = company.users.some(user => user.id === userId);
    if (isUserAlreadyInCompany) {
      return company;
    }
    

    company.users.push(userToAdd);
    return this.companiesRepository.save(company);
  }

  async removeUserFromCompany(companyId: number, userId: number, currentUser: User): Promise<Company> {

    const company = await this.findOne(companyId, currentUser);
    

    if (company.users.length <= 1) {
      throw new ForbiddenException('Não é possível remover o último usuário da empresa');
    }
    

    company.users = company.users.filter(user => user.id !== userId);
    return this.companiesRepository.save(company);
  }
}
