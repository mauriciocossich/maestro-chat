import { getCustomRepository, Repository } from "typeorm";
import { Setting } from "../entities/Setting";
import { SettingsRepository } from "../repositories/SettingsRepository";

interface ISettingsCreate {
  chat: boolean;
  username: string;
}

class SettingsService {
  private settingsRepository: Repository<Setting>;

  constructor() {
    this.settingsRepository = getCustomRepository(SettingsRepository);
  }

  async create({ chat, username }: ISettingsCreate) {
    // Select * from settings where username = "username" limit 1;
    const userAlreadyExistis = await this.settingsRepository.findOne({
      username,
    });

    if (userAlreadyExistis) {
      throw new Error("User already exists!");
    }

    // Criar objeto (settings) dentro de uma tabela: 2 coisas
    const settings = this.settingsRepository.create({
      chat,
      username,
    });

    await this.settingsRepository.save(settings);

    return settings;
  }

  async findByUsername(username: string) {
    const settings = await this.settingsRepository.findOne({
      username,
    });

    return settings;
  }

  // atualizar configuração no banco de dados para esconder o chat
  async update(username: string, chat: boolean) {
    await this.settingsRepository
      .createQueryBuilder()
      .update(Setting)
      .set({ chat })
      .where("username = :username", {
        username,
      })
      .execute();
  }
}

export { SettingsService };
