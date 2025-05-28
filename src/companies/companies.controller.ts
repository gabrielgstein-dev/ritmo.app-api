import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @GetUser() user: User) {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.companiesService.findAllByUser(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.companiesService.findOne(+id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @GetUser() user: User) {
    return this.companiesService.update(+id, updateCompanyDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.companiesService.remove(+id, user);
  }

  @Post(':id/users/:userId')
  addUserToCompany(
    @Param('id') companyId: string,
    @Param('userId') userId: string,
    @GetUser() user: User,
  ) {
    return this.companiesService.addUserToCompany(+companyId, +userId, user);
  }

  @Delete(':id/users/:userId')
  removeUserFromCompany(
    @Param('id') companyId: string,
    @Param('userId') userId: string,
    @GetUser() user: User,
  ) {
    return this.companiesService.removeUserFromCompany(+companyId, +userId, user);
  }
}
