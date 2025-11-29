import express from 'express';
import { Container } from 'typedi';
import { DiscoveryService } from '../service/discovery';
import { ActionService } from '../service/action';
import { toModel } from '../../interfaces/DiscoveryDTO';

const router = express.Router();

const discoveryService = Container.get(DiscoveryService);
const actionService = Container.get(ActionService);

router.get<{}, any>('/all', async (req, res) => {
  res.json(await discoveryService.getDiscoveries());
});

router.get<{}, any>('/:id', async (req, res) => {
  // @ts-ignore
  res.json(await discoveryService.getDiscovery(parseInt(req.params.id)));
});

router.get<{}, any>('/:targetId/action/:id', async (req, res) => {
  // Required headers for Server Side Events (real-time CLI output)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Connection', 'keep-alive');

  // @ts-ignore
  await actionService.executeAction(res, parseInt(req.params.targetId), parseInt(req.params.id), req.query.prompt);
});

router.post<{}, any>('/', async (req, res) => {
  res.json(await discoveryService.newDiscovery(toModel(req.body)));
});

router.put<{}, any>('/:id', async (req, res) => {
  // @ts-ignore
  res.json(await discoveryService.editDiscovery(parseInt(req.params.id), req.body));
});

router.delete<{}, any>('/:id', async (req, res) => {
  // @ts-ignore
  res.json(await discoveryService.deleteDiscovery(req.params.id));
});

export default router;
