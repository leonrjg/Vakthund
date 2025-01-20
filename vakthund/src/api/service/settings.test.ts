import { SettingsService } from './settings';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');

describe('SettingsService', () => {
  let service: SettingsService;

  let configSample = path.join(__dirname, '../../../config/vk-config-sample.json');

  let config = path.join(__dirname, '../../../config/vk-config.json');

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
    it('should return parsed settings when file is readable', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(JSON.stringify({ key: 'value', key2: 'value2' }));
      (fs.readFileSync as jest.Mock).mockReturnValueOnce(JSON.stringify({ key: 'other-value', key3: 'value3' }));

      const result = await service.getSettings();

      expect(result).toEqual({ key: 'other-value', key2: 'value2', key3: 'value3' });
      expect(fs.readFileSync).toHaveBeenCalledWith(configSample, 'utf-8');
      expect(fs.readFileSync).toHaveBeenCalledWith(config, 'utf-8');
    });

    it('should return null when file read throws error', async () => {
      (fs.readFileSync as jest.Mock).mockImplementationOnce(() => {
        throw new Error('File not found');
      });

      const result = await service.getSettings();

      expect(result).toBeNull();
    });
  });

  describe('writeSettings', () => {
    it('should write settings to file and return true when writing is successful', async () => {
      const body = { key: 'value' };
      const filePath = path.join(__dirname, '../../../config/vk-config.json');

      (fs.writeFileSync as jest.Mock).mockReturnValueOnce(undefined);

      const result = await service.writeSettings(body);

      expect(result).toBe(true);
      expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, JSON.stringify(body), 'utf-8');
    });

    it('should return false when file write throws an error', async () => {
      const body = { key: 'value' };
      const filePath = path.join(__dirname, '../../../config/vk-config.json');

      (fs.writeFileSync as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Error writing file');
      });

      const result = await service.writeSettings(body);

      expect(result).toBe(false);
      expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, JSON.stringify(body), 'utf-8');
    });
  });
});
