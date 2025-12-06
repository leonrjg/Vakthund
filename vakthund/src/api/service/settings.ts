import { Service } from 'typedi';
import path from 'path';
import * as fs from 'fs';

@Service()
export class SettingsService {

  configSample = path.join(__dirname, '../../../config/vk-config-sample.json');

  config = path.join(__dirname, '../../../../data/vk-config.json');

  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  getSettings = async () => {
    const structure = fs.readFileSync(this.configSample, 'utf-8');

    let userData;
    try {
      userData = fs.readFileSync(this.config, 'utf-8');
    } catch (error) {
      userData = '{}';
    }

    // Deep merge user config values (vk-config.json) with the base config structure (vk-config-sample.json)
    return this.deepMerge(JSON.parse(structure), JSON.parse(userData));


  };

  writeSettings = async (body: any) => {
    try {
      console.log('writeSettings received timezone:', body.preferences?.timezone);
      fs.writeFileSync(this.config, JSON.stringify(body), 'utf-8');
      console.log('Wrote settings to disk');
      const verification = JSON.parse(fs.readFileSync(this.config, 'utf-8'));
      console.log('Verification read timezone:', verification.preferences?.timezone);
      return true;
    } catch (error) {
      console.error('writeSettings error:', error);
      return false;
    }
  };

}