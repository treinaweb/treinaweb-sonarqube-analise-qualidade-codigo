import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 50)
  @IsString()
  nome: string;

  @IsNotEmpty()
  @Length(5, 25)
  email: string;

  @IsNotEmpty()
  @Length(8,8)
  cep: string;

  @IsNotEmpty()
  @Length(8, 20)
  password: string;
}
