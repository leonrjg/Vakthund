import { Service } from 'typedi';
import path from 'path';
import * as fs from 'fs';

@Service()
export class SettingsService {
  
  configSample = path.join(__dirname, '../../../config/vk-config-sample.json');

  config = path.join(__dirname, '../../../config/vk-config.json');

  getSettings = async () => {
    try {
      const structure = fs.readFileSync(this.configSample, 'utf-8');
      const userData = fs.readFileSync(this.config, 'utf-8');
      return Object.assign(JSON.parse(structure), JSON.parse(userData));
    } catch (error) {
      return null;
    }
  };

  writeSettings = async (body: any) => {
    try {
      fs.writeFileSync(this.config, JSON.stringify(body), 'utf-8');
      return true;
    } catch (error) {
      return false;
    }
  };

}