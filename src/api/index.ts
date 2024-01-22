import express from 'express';

import discovery from './controller/discovery';
import settings from './controller/settings';
import device from './controller/device';

const router = express.Router();

router.use('/discovery', discovery);
router.use('/settings', settings);
router.use('/device', device);

export default router;
