import { Router } from 'express';

import { AuthController } from './auth.controller.js';

import {
  loginSchema,
  registerSchema,
} from './auth.validation.js';

import { validate } from '../../common/middlewares/validate.middleware.js';

import { protect } from '../../common/middlewares/auth.middleware.js';

const router = Router();

router.post(
  '/register',
  validate(registerSchema),
  AuthController.register,
);

router.post(
  '/login',
  validate(loginSchema),
  AuthController.login,
);

router.post(
  '/refresh-token',
  AuthController.refreshToken,
);

router.post(
  '/logout',
  AuthController.logout,
);

router.get(
  '/me',
  protect,
  AuthController.me,
);

export default router;