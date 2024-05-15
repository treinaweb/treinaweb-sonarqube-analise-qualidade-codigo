import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ICepService } from '../../src/core/consulta-cep/consulta-cep';
import { CepService } from '../../src/core/consulta-cep/consulta-cep.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, {
    provide: ICepService,
    useClass: CepService,
  }],
})
export class UsersModule {}
