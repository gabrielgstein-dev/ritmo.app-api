import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeRecordDto } from './create-time-record.dto';

export class UpdateTimeRecordDto extends PartialType(CreateTimeRecordDto) {}
