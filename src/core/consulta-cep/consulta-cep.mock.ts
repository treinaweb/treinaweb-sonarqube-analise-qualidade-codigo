import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CidadeResponseDto } from './dto/cidade-response.dto';
import { ICepService } from './consulta-cep';

@Injectable()
export class CepServiceMock implements ICepService {

  async buscarCidadePorCep(
    cep: string,
  ): Promise<CidadeResponseDto> {

    if(cep === "00") {
      throw new BadRequestException('CEP inválido');
    }

    if(cep === "00000000") {
      throw new NotFoundException('CEP não localizado');
    }
    
    let cidade: CidadeResponseDto = {
      cidade: 'Guarulhos',
      estado: 'SP',
      logradouro: 'Rua Utama',
      cep: '07020-321'
    }
    return cidade;
  }
}