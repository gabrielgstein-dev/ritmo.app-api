import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TimeRecordsService } from './time-records.service';
import { CreateTimeRecordDto } from './dto/create-time-record.dto';
import { UpdateTimeRecordDto } from './dto/update-time-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('time-records')
export class TimeRecordsController {
  constructor(private readonly timeRecordsService: TimeRecordsService) {}

  @Post()
  create(@Body() createTimeRecordDto: CreateTimeRecordDto, @GetUser() user: User) {
    return this.timeRecordsService.create(createTimeRecordDto, user);
  }

  @Get()
  findAll(
    @GetUser() user: User,
    @Query('companyId') companyId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.timeRecordsService.findAll(
      user,
      companyId ? +companyId : undefined,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.timeRecordsService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTimeRecordDto: UpdateTimeRecordDto,
    @GetUser() user: User,
  ) {
    return this.timeRecordsService.update(+id, updateTimeRecordDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.timeRecordsService.remove(+id, user);
  }

  @Get('company/:companyId/range')
  findByDateRange(
    @GetUser() user: User,
    @Param('companyId') companyId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.timeRecordsService.findByDateRange(
      user,
      +companyId,
      new Date(startDate),
      new Date(endDate),
    );
  }
}
