import { getCustomRepository, Repository } from "typeorm";
import { Message } from "../entities/Message";
import { MessagesRepository } from "../repositories/MessagesRepository";

interface IMessageCreate {
  admin_id?: string;
  text: string;
  user_id: string;
}

class MessagesService {
  //atributo disponível apenas para a classe, no caso, MessagesService
  private messagesRepository: Repository<Message>;

  constructor() {
    this.messagesRepository = getCustomRepository(MessagesRepository);
  }

  async create({ admin_id, text, user_id }: IMessageCreate) {
    const message = this.messagesRepository.create({
      admin_id,
      text,
      user_id,
    });

    // Quando o atributo é da classe e não do método, chamamos pelo operador this
    // This referencia a classe
    await this.messagesRepository.save(message);

    return message;
  }

  async listByUser(user_id: string) {
    const list = await this.messagesRepository.find({
      where: { user_id },
      relations: ["user"],
    });

    return list;
  }
}

export { MessagesService };
