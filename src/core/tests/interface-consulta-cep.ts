import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ICepService } from "../consulta-cep/consulta-cep";
import { CidadeResponseDto } from "../consulta-cep/dto/cidade-response.dto";

async function itServiceDfined(service: ICepService) {
  expect(service).toBeDefined();
}

async function itReturnCity(service: ICepService) {
  const twoCharRegex = /^.{2}$/;
  const cidade: CidadeResponseDto = {
    cidade: expect.any(String),
    estado: expect.stringMatching(twoCharRegex),
    logradouro: expect.any(String),
    cep: "07020-321"
  }

  const cepValido = '07020321';

  const result = await service.buscarCidadePorCep(cepValido);
  expect(result).toEqual(cidade);
}

async function itThrowNotFoundException(service: ICepService) {
  const cepInexistente = '00000000';

  await expect(service.buscarCidadePorCep(cepInexistente))
    .rejects.toThrow(new NotFoundException('CEP não localizado'));
}

async function itThrowBadRequestException(service:ICepService) {
  const cepInvalido = '00';

    await expect(service.buscarCidadePorCep(cepInvalido))
    .rejects.toThrow(new BadRequestException('CEP inválido'));
}

export { itServiceDfined, itReturnCity, itThrowBadRequestException, itThrowNotFoundException }