import jwt from 'jsonwebtoken';

import { env } from '../../config/env.js';

export const generateAccessToken = (
  userId: string,
  role: string,
) => {
  return jwt.sign(
    {
      userId,
      role,
    },

    env.JWT_ACCESS_SECRET,

    {
      expiresIn: '15m',
    },
  );
};

export const generateRefreshToken = (
  userId: string,
) => {
  return jwt.sign(
    {
      userId,
    },

    env.JWT_REFRESH_SECRET,

    {
      expiresIn: '7d',
    },
  );
};