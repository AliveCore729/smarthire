import { Router } from 'express';

import { ResumeController } from './resume.controller.js';

import { protect } from '../../common/middlewares/auth.middleware.js';

import { upload } from '../../common/utils/multer.util.js';

const router = Router();

router.post(
  '/upload',

  protect,

  upload.single('resume'),

  ResumeController.uploadResume,
);

export default router;