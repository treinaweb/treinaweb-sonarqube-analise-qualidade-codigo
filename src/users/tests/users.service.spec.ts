import { Repository } from "typeorm";
import { UsersService } from "../users.service"
import { User } from "../entities/user.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { ICepService } from "../../core/consulta-cep/consulta-cep"
import { CepServiceMock } from "../../core/consulta-cep/consulta-cep.mock";
import { getRepositoryToken } from "@nestjs/typeorm";
import { deleteResultMock, deleteResultMockException, updateResultMock, updateResultMockException, userMock } from "./users-mocks";
import { CreateUserDto } from "../dto/create-user.dto";
import { NotFoundException } from "@nestjs/common";

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let cepService: ICepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
        {
          provide: ICepService,
          useClass: CepServiceMock,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockResolvedValue(userMock),
            find: jest.fn().mockResolvedValue([userMock, userMock]),
            save: jest.fn().mockResolvedValue(userMock),
            findOneBy: jest.fn().mockResolvedValue(userMock),
            update: jest.fn().mockResolvedValue(updateResultMock),
            delete: jest.fn().mockResolvedValue(deleteResultMock),
          }
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    cepService = module.get<ICepService>(ICepService);
  });

  it('service e repository devem estar definidos', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('deve retornar um usuário no método create', async () => {
    const userDto: CreateUserDto = {
      nome: userMock.nome,
      email: userMock.email,
      cep: "07020--321",
      password: userMock.password,
    }

    const endereco = await cepService.buscarCidadePorCep(userDto.cep);
    const user = await service.create(userDto);

    user.cidade = endereco.cidade;
    user.estado = endereco.estado;
    user.logradouro = endereco.logradouro;
    user.cep = endereco.cep;


    expect(user).toEqual(userMock);
  });

  it('deve retornar lista de usuários chamando método findAll', async () => {
    const usersMock = [userMock, userMock];

    const users = await service.findAll();
    expect(users).toEqual(usersMock);
  });

  it('deve retornar sucesso no método update', async () => {
    const result = await service.update(userMock.id, userMock);
    expect(result).toEqual(updateResultMock);
  });

  it('deve retornar exceção NotFoundException no método update', async () => {
    jest.spyOn(userRepository, 'update').mockResolvedValue(updateResultMockException);
    await expect(service.update(userMock.id, userMock))
      .rejects.toThrow(new NotFoundException('Usuário não encontrado!'));
  });

  it('deve retornar sucesso no método remove', async () => {
    const result = await service.remove(userMock.id);
    expect(result).toEqual(deleteResultMock);
  });

  it('deve retornar exceção NotFoundException no método remove', async () => {
    jest.spyOn(userRepository, 'delete').mockResolvedValue(deleteResultMockException);
    await expect(service.remove(userMock.id))
      .rejects.toThrow(new NotFoundException('Usuário não encontrado!'));
  });

  it('deve retornar usuário por ID no método findOne', async () => {
    const user = await service.findOne(userMock.id);
    expect(user).toEqual(userMock);
  });

  it('deve retornar NotFoundException para usuário não encontrado no método findOne', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);
    expect(service.findOne(userMock.id)).rejects.toThrow(new NotFoundException('Usuário não encontrado!'));
  });

})