import { Router } from 'express';
import { ApplicationController } from './application.controller.js';
import { protect } from '../../common/middlewares/auth.middleware.js';

const router = Router();

router.use(protect); // All application routes require authentication

router.get('/', ApplicationController.getApplications);
router.post('/', ApplicationController.createApplication);
router.patch('/:id/status', ApplicationController.updateApplicationStatus);
router.delete('/:id', ApplicationController.deleteApplication);

export default router;
