import { DeleteResult, UpdateResult } from "typeorm";
import { User } from "../entities/user.entity";

export const userMock: User = {
  id: 50,
  nome: "Paulo",
  cidade: "Guarulhos",
  estado: "SP",
  logradouro: "Rua Utama",
  cep: "07020-321",
  email: "paulo@gmail.com",
  password: "123123123"
}

export const updateResultMock: UpdateResult = {
  raw: 0,
  generatedMaps: [],
  affected: 1
}

export const deleteResultMock: DeleteResult = {
  raw: 0,
  affected: 1
}

export const updateResultMockException: UpdateResult = {
  raw: 0,
  generatedMaps: [],
  affected: 0
}

export const deleteResultMockException: DeleteResult = {
  raw: 0,
  affected: 0
}

