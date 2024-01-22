import { Service, Inject } from 'typedi';
import { ActionRepository } from '../repository/action';
import { spawn } from 'child_process';
import express from 'express';
import { DiscoveryService } from './discovery';
import path from 'path';
import * as fs from 'fs';

@Service()
export class SettingsService {

  filePath = path.join(__dirname, '../../../config/vk-config.json');

  getSettings = async () => {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  };

  writeSettings = async (body: any) => {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(body), 'utf-8');
      return true;
    } catch (error) {
      return false;
    }
  };

}