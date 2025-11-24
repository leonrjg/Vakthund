import { SettingsService } from './settings';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');

const mockSampleConfig = JSON.stringify({
  engines: {
    Shodan: { api_key: '', tag_attributes: ['location.city'] },
    ZoomEye: { api_key: '', tag_attributes: ['rdns'] },
    Censys: { api_key: '', tag_attributes: ['province'] }
  }
});

const mockUserConfig = JSON.stringify({
  engines: {
    Shodan: { api_key: 'user-shodan-key' }
  }
});

describe('SettingsService', () => {
  let service: SettingsService;

  const configSamplePath = path.join(__dirname, '../../../config/vk-config-sample.json');
  const configPath = path.join(__dirname, '../../../data/vk-config.json');

  beforeEach(() => {
    service = new SettingsService();
    jest.spyOn(fs, 'readFileSync');
    jest.spyOn(fs, 'writeFileSync');
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe('getSettings', () => {
    it('should deep merge nested objects preserving sample keys', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(mockSampleConfig);
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(mockUserConfig);

      const result = await service.getSettings();

      expect(result.engines.Shodan.api_key).toBe('user-shodan-key');
      expect(result.engines.Shodan.tag_attributes).toEqual(['location.city']);
      expect(result.engines.ZoomEye).toEqual({ api_key: '', tag_attributes: ['rdns'] });
      expect(result.engines.Censys).toEqual({ api_key: '', tag_attributes: ['province'] });
      expect(fs.readFileSync).toHaveBeenCalledWith(configSamplePath, 'utf-8');
      expect(fs.readFileSync).toHaveBeenCalledWith(configPath, 'utf-8');
    });

    it('should preserve all engines from sample when user adds a new engine', async () => {
      const sampleConfig = JSON.stringify({
        engines: {
          Shodan: { api_key: '' },
          ZoomEye: { api_key: '' }
        }
      });
      const userConfig = JSON.stringify({
        engines: {
          CustomEngine: { api_key: 'custom-key' }
        }
      });

      (fs.readFileSync as jest.Mock).mockReturnValueOnce(sampleConfig);
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(userConfig);

      const result = await service.getSettings();

      expect(Object.keys(result.engines)).toHaveLength(3);
      expect(result.engines.Shodan).toEqual({ api_key: '' });
      expect(result.engines.ZoomEye).toEqual({ api_key: '' });
      expect(result.engines.CustomEngine).toEqual({ api_key: 'custom-key' });
    });

    it('should handle deeply nested objects', async () => {
      const sampleConfig = JSON.stringify({
        level1: {
          level2: {
            level3: { a: 1, b: 2 }
          }
        }
      });
      const userConfig = JSON.stringify({
        level1: {
          level2: {
            level3: { b: 20, c: 30 }
          }
        }
      });

      (fs.readFileSync as jest.Mock).mockReturnValueOnce(sampleConfig);
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(userConfig);

      const result = await service.getSettings();

      expect(result.level1.level2.level3).toEqual({ a: 1, b: 20, c: 30 });
    });

    it('should replace arrays instead of merging them', async () => {
      const sampleConfig = JSON.stringify({
        engines: {
          Shodan: { tag_attributes: ['attr1', 'attr2'] }
        }
      });
      const userConfig = JSON.stringify({
        engines: {
          Shodan: { tag_attributes: ['custom-attr'] }
        }
      });

      (fs.readFileSync as jest.Mock).mockReturnValueOnce(sampleConfig);
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(userConfig);

      const result = await service.getSettings();

      expect(result.engines.Shodan.tag_attributes).toEqual(['custom-attr']);
    });

    it('should return sample config when user config is empty', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(mockSampleConfig);
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(JSON.stringify({}));

      const result = await service.getSettings();

      expect(result).toEqual(JSON.parse(mockSampleConfig));
    });

    it('should return sample config when user config file does not exist', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(mockSampleConfig);
      (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {
        throw new Error('File not found');
      });

      const result = await service.getSettings();

      expect(result).toEqual(JSON.parse(mockSampleConfig));
    });
  });

  describe('writeSettings', () => {
    it('should write settings to file and return true', async () => {
      const body = { engines: { Shodan: { api_key: 'new-key' } } };

      (fs.writeFileSync as jest.Mock).mockReturnValueOnce(undefined);

      const result = await service.writeSettings(body);

      expect(result).toBe(true);
      expect(fs.writeFileSync).toHaveBeenCalledWith(configPath, JSON.stringify(body), 'utf-8');
    });

    it('should return false when file write throws an error', async () => {
      const body = { engines: { Shodan: { api_key: 'new-key' } } };

      (fs.writeFileSync as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Error writing file');
      });

      const result = await service.writeSettings(body);

      expect(result).toBe(false);
    });
  });
});
