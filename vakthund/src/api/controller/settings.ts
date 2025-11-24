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
  // Refresh scheduler in case scan_interval_in_minutes changed
  await schedulerService.refreshSchedule();
  res.json(result);
});

export default router;
