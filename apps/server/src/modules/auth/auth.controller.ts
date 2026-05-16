import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AuthService } from './auth.service.js';

import { User } from '../../database/models/user.model.js';

import { generateAccessToken } from '../../common/utils/token.util.js';

import { env } from '../../config/env.js';

export class AuthController {
  static async register(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const user = await AuthService.register(
      name,
      email,
      password,
    );

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',

      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } =
      await AuthService.login(email, password);

    const isProduction =
      env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',

      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken =
        req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token missing',
        });
      }

      const decoded = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET,
      ) as {
        userId: string;
      };

      const user = await User.findById(
        decoded.userId,
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      const newAccessToken =
        generateAccessToken(
          user._id.toString(),
          user.role,
        );

      const isProduction =
        env.NODE_ENV === 'production';

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: 'Token refreshed',
      });
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }
  }

  static async logout(
    _req: Request,
    res: Response,
  ) {
    res.clearCookie('accessToken');

    res.clearCookie('refreshToken');

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  }

  static async me(req: any, res: Response) {
    const user = await User.findById(
      req.user.userId,
    ).select('-password');

    return res.status(200).json({
      success: true,
      data: user,
    });
  }
}