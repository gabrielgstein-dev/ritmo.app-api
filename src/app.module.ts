import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimeCalculatorModule } from './time-calculator/time-calculator.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { TimeRecordsModule } from './time-records/time-records.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST'),
          port: +configService.get<string>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
          migrationsRun: configService.get<boolean>('DB_MIGRATIONS_RUN') || false,
          synchronize: configService.get<boolean>('DB_SYNCHRONIZE') || false,
        };
      },
    }),
    AuthModule,
    UsersModule,
    CompaniesModule,
    TimeRecordsModule,
    TimeCalculatorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
