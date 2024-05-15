import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ICepService } from '../src/core/consulta-cep/consulta-cep';
import { CepServiceMock } from '../src/core/consulta-cep/consulta-cep.mock';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configTest } from '../src/orm-config';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forRoot(configTest)],
    }).overrideProvider(ICepService)
      .useClass(CepServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterEach(async () => {
    const dataSource = app.get(DataSource);
    dataSource.dropDatabase();
  })

  it('/users (GET) - Deve retornar lista de usuários', async () => {
    await request(app.getHttpServer()).post('/users').send({
      nome: 'Bruna gado',
      cep: '07020321',
      email: 'bruna.gado@teste.com',
      password: '123123123'
    })

    await request(app.getHttpServer()).post('/users').send({
      nome: 'Wesley Oliveira',
      cep: '07020321',
      email: 'wesley.oliveira@teste.com',
      password: '123123123'
    })

    const users = [
      {
        id: expect.any(Number),
        nome: 'Bruna gado',
        cidade: 'Guarulhos',
        estado: 'SP',
        logradouro: 'Rua Utama',
        cep: '07020-321',
        email: 'bruna.gado@teste.com',
        password: '123123123'
      },
      {
        id: expect.any(Number),
        nome: 'Wesley Oliveira',
        cidade: 'Guarulhos',
        estado: 'SP',
        logradouro: 'Rua Utama',
        cep: '07020-321',
        email: 'wesley.oliveira@teste.com',
        password: '123123123'
      }
    ]

    const response = await request(app.getHttpServer())
      .get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(users);
  })

  it('/users (POST) - Deve cadastrar novo usuário válido', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        nome: 'Wesley',
        email: 'wesley@teste.com',
        password: '123123123',
        cep: '07020321'
      })

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      nome: 'Wesley',
      email: 'wesley@teste.com',
      password: '123123123',
      cep: '07020-321',
      cidade: 'Guarulhos',
      estado: 'SP',
      logradouro: 'Rua Utama',
      id: expect.any(Number)
    })
  })

  it('/users (POST) - Deve retornar NotFoundException para cep não encontrado', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        nome: 'Wesley',
        email: 'wesley@teste.com',
        password: '123123123',
        cep: '00000000'
      })

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not Found',
      message: 'CEP não localizado',
      statusCode: 404,
    })
  })

  it('/users (POST) - Deve retornar BadRequestException para cep inválido', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        nome: 'Wesley',
        email: 'wesley@teste.com',
        password: '123123123',
        cep: '00'
      })

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Bad Request',
      message: ['cep must be longer than or equal to 8 characters'],
      statusCode: 400,
    })
  })

  it('/users (POST) - Deve retornar BadRequestException para nome inválido por número de caracteres', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        nome: 'W',
        email: 'wesley@teste.com',
        password: '123123123',
        cep: '07020321'
      })

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Bad Request',
      message: ['nome must be longer than or equal to 3 characters'],
      statusCode: 400,
    })
  })

  it('/users (PATCH) - Deve atualizar usuário já cadastrado com sucesso', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        nome: 'Wesley',
        email: 'wesley@teste.com',
        password: '123123123',
        cep: '07020321'
      })

    const response = await request(app.getHttpServer())
      .patch('/users/1')
      .send({
        nome: 'Wesley Oliveira',
        email: 'wesley.oliveira@teste.com'
      })

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      affected: 1,
      generatedMaps: [],
      raw: [],
    })
  })

  it('/users (PATCH) - Deve lançar NotFoundException ao tentar atualizar usuário não existente', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/42')
      .send({
        nome: 'Wesley Oliveira',
        email: 'wesley.oliveira@teste.com'
      })

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not Found',
      message: 'Usuário não encontrado!',
      statusCode: 404,
    })
  })

  it('/users (DELETE) - Deve excluir usuário já cadastrado com sucesso', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        nome: 'Wesley',
        email: 'wesley@teste.com',
        password: '123123123',
        cep: '07020321'
      })

    const response = await request(app.getHttpServer())
      .delete('/users/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      affected: 1,
      raw: [],
    })
  })

  it('/users (DELETE) - Deve lançar NotFoundException ao tentar excluir usuário não existente', async () => {
    const response = await request(app.getHttpServer())
      .delete('/users/42');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not Found',
      message: 'Usuário não encontrado!',
      statusCode: 404,
    })
  })

  it('/users/:id (GET) - Deve retornar usuário válido por id', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send({
        nome: 'Wesley',
        email: 'wesley@teste.com',
        password: '123123123',
        cep: '07020321'
      })

    const response = await request(app.getHttpServer()).get('/users/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      nome: 'Wesley',
      email: 'wesley@teste.com',
      password: '123123123',
      cep: '07020-321',
      cidade: 'Guarulhos',
      estado: 'SP',
      logradouro: 'Rua Utama',
      id: 1
    })
  })

  it('/users/:id (GET) - Deve retornar NotFoundException ao buscar usuário inexistente por id', async () => {
    const response = await request(app.getHttpServer()).get('/users/45');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not Found',
      message: 'Usuário não encontrado!',
      statusCode: 404,
    })
  })
});
