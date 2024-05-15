import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configTest } from './orm-config';

@Module({
  imports: [
    TypeOrmModule.forRoot(configTest),
    UsersModule],
})
export class AppModule { }
