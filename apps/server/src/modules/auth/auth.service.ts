import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../../database/models/user.model.js';
import { env } from '../../config/env.js';

export class AuthService {
  static async register(
    name: string,
    email: string,
    password: string,
  ) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },

      env.JWT_ACCESS_SECRET,

      {
        expiresIn: '15m',
      },
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id,
      },

      env.JWT_REFRESH_SECRET,

      {
        expiresIn: '7d',
      },
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}