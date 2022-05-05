import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

import { v4 as uuid } from "uuid";

@Entity("settings")
class Setting {
  // Poderia passar dentro da anotation em {}, um nome diferente do db caso queira.
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  chat: boolean;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    // Construtor é o método chamado toda vez que da um: new NomeClasse(){}
    // Verificação para saber se estamos trabalhando com atualização de dados, que ai já tem id
    if (!this.id) {
      // this le todos os atributos da classe
      this.id = uuid();
    }
  }
}

export { Setting };
