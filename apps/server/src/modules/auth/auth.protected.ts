import { Router } from 'express';

import { protect } from '../../common/middlewares/auth.middleware.js';

const router = Router();

router.get('/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Protected route accessed',
  });
});

export default router;