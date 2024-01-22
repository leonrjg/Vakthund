import express from 'express';
import { Container } from 'typedi';
import { DeviceService } from '../service/device';
import { toModel } from '../../interfaces/DeviceDTO';
import { ActionService } from '../service/action';

const router = express.Router();

const deviceService = Container.get(DeviceService);
const actionService = Container.get(ActionService);

router.get<{}, any>('/all', async (req, res) => {
  res.json(await deviceService.getDevices());
});

router.post<{}, any>('/action', async (req, res) => {
  res.json(await actionService.postAction(req.body));
});

router.get<{}, any>('/:id', async (req, res) => {
  // @ts-ignore
  res.json(await deviceService.getDeviceById(parseInt(req.params.id)));
});

router.post<{}, any>('/', async (req, res) => {
  res.json(await deviceService.newDevice(req.body));
});

router.delete<{}, any>('/:id', async (req, res) => {
  // @ts-ignore
  res.json(await deviceService.deleteDevice(parseInt(req.params.id)));
});

export default router;
