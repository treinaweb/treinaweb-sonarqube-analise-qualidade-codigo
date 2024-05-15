import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ICepService } from '../core/consulta-cep/consulta-cep';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cepService: ICepService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const endereco = await this.cepService.buscarCidadePorCep(createUserDto.cep);
    const user = this.userRepository.create(createUserDto);

    user.cidade = endereco.cidade;
    user.estado = endereco.estado;
    user.logradouro = endereco.logradouro;
    user.cep = endereco.cep;

    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!')
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.userRepository.create(updateUserDto);
    const result = await this.userRepository.update(id, user);

    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return result;
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Usuário não encontrado!')
    }

    return result;
  }
}
