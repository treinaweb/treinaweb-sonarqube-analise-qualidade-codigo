import { plainToInstance } from "class-transformer"
import { CreateUserDto } from "./create-user.dto"
import { validate } from "class-validator";

describe('Validações UserDto', () => {

  it('Deve retornar error na validação da propriedade nome - número de caracteres inválido', async () => {
    const user = plainToInstance(CreateUserDto, { nome: "We" });

    const errors = await validate(user);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('nome');
    expect(errors[0].constraints).toEqual({ "isLength": "nome must be longer than or equal to 3 characters" })
  })
})