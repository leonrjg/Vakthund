import express from 'express';
import { Container } from 'typedi';
import { DiscoveryService } from '../service/discovery';
import { ActionService } from '../service/action';
import { SettingsService } from '../service/settings';

const router = express.Router();

const settingsService = Container.get(SettingsService);

router.get<{}, any>('', async (req, res) => {
  res.json(await settingsService.getSettings());
});

router.post<{}, any>('', async (req, res) => {
  res.json(await settingsService.writeSettings(req.body));
});

export default router;
