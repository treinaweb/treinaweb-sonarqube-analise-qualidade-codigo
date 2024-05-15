import { Test, TestingModule } from "@nestjs/testing";
import { ICepService } from "../consulta-cep/consulta-cep"
import { CepServiceMock } from "../consulta-cep/consulta-cep.mock";
import { itReturnCity, itServiceDfined, itThrowBadRequestException, itThrowNotFoundException } from "./interface-consulta-cep";

describe('Consumo de API CEP - Mock', () => {
  let service: ICepService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ICepService,
          useClass: CepServiceMock,
        }
      ],
    }).compile();

    service = module.get<ICepService>(ICepService);
  });

  it('service definido', () => {
    itServiceDfined(service);
   })
 
   it('retorna cidade, estado, logradouro e cep válidos', async () => {
     await itReturnCity(service);
   });
 
   it('retorna NotFoundException caso cep não seja encontrado', async () => {
    await itThrowNotFoundException(service);
   });
 
   it('retorna BadRequestException caso cep seja inválido', async () => {
     await itThrowBadRequestException(service);
   });
})