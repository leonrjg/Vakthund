import express from 'express';
import { Container } from 'typedi';
import { SettingsService } from '../service/settings';
import { SchedulerService } from '../service/scheduler';

const router = express.Router();

const settingsService = Container.get(SettingsService);
const schedulerService = Container.get(SchedulerService);

router.get<{}, any>('', async (req, res) => {
  res.json(await settingsService.getSettings());
});

router.post<{}, any>('', async (req, res) => {
  const result = await settingsService.writeSettings(req.body);
  await schedulerService.initialize();
  res.json(result);
});

router.get<{}, any>('/next-scan', async (req, res) => {
  const nextRun = schedulerService.getNextRun();
  res.json({ nextRun: nextRun?.toISOString() || null });
});

export default router;
