import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { CidadeResponseDto } from './dto/cidade-response.dto';
import { ICepService } from './consulta-cep';

@Injectable()
export class CepService implements ICepService{
  BASE_URL = 'https://viacep.com.br/ws';

  async buscarCidadePorCep(
    cep: string,
  ): Promise<CidadeResponseDto> {
    const url = `${this.BASE_URL}/${cep}/json`;
    const cidade = new CidadeResponseDto();

    try {
      const response = await axios.get(url);
      cidade.cidade = response.data.localidade;
      cidade.estado = response.data.uf;
      cidade.logradouro = response.data.logradouro;
      cidade.cep = response.data.cep;

      if (response.data.erro === true) {
        throw new NotFoundException();
      }

      return cidade;
    } catch (error) {

      if (error.response.statusCode === 404) {
        throw new NotFoundException('CEP não localizado');
      }

      if (error.response.status === 400) {
        throw new BadRequestException('CEP inválido');
      }

      throw new Error(error);
    }
  }
}