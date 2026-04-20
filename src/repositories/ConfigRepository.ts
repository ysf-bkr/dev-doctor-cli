import os from 'os';
import path from 'path';
import fs from 'fs-extra';

export class ConfigRepository {
  private readonly configPath = path.join(os.homedir(), '.dev-doctorrc.json');

  async read(): Promise<any | null> {
    if (!(await fs.pathExists(this.configPath))) {
      return null;
    }
    try {
      return await fs.readJson(this.configPath);
    } catch {
      return null;
    }
  }

  async write(config: any): Promise<void> {
    await fs.writeJson(this.configPath, config, { spaces: 2 });
  }

  async exists(): Promise<boolean> {
    return await fs.pathExists(this.configPath);
  }
}
