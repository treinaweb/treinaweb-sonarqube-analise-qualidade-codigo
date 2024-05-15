import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, length: 150 })
  nome: string;

  @Column({ nullable: false })
  cidade: string;

  @Column({ nullable: false })
  estado: string;

  @Column({ nullable: false })
  logradouro: string;

  @Column({ nullable: false })
  cep: string;

  @Column({ nullable: false, length: 150, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;
}
