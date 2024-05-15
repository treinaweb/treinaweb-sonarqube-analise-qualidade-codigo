import { CidadeResponseDto } from "./dto/cidade-response.dto";

export abstract class ICepService {
  abstract buscarCidadePorCep(
    cep: string,
  ): Promise<CidadeResponseDto>
}