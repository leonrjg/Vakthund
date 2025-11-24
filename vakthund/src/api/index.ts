import express from 'express';

import discovery from './controller/discovery';
import settings from './controller/settings';
import device from './controller/device';
import scan from './controller/scan';
import logs from './controller/logs';

const router = express.Router();

router.use('/discovery', discovery);
router.use('/settings', settings);
router.use('/device', device);
router.use('/scan', scan);
router.use('/logs', logs);

export default router;
