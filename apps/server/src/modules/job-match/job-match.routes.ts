import { Router } from 'express';

import { JobMatchController } from './job-match.controller.js';

import { protect } from '../../common/middlewares/auth.middleware.js';

const router = Router();

router.post(
  '/analyze',

  protect,

  JobMatchController.matchResume,
);

export default router;