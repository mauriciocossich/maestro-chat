import { Repository, EntityRepository } from "typeorm";

import { Setting } from "../entities/Setting";

// da acesso aos comandos sql pelo typeorm
@EntityRepository(Setting)
class SettingsRepository extends Repository<Setting> {}

export { SettingsRepository };
