import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

import crypto from 'crypto';
import { User } from '../../database/models/user.model.js';
import { env } from '../../config/env.js';
import { emailService } from '../email/email.service.js';

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
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpiresAt,
    });

    try {
      await emailService.sendVerificationEmail(email, verificationToken);
    } catch (error) {
      console.error('Email send failed, but user created');
    }

    return user;
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new Error('Please verify your email before logging in');
    }

    if (!user.password) {
      throw new Error('Please login with your Google account');
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

  static async googleAuth(accessToken: string) {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile from Google');
    }

    const payload = await response.json();

    const { email, name } = payload;
    if (!email) {
      throw new Error('No email found in Google token');
    }

    // Check if user exists
    let user = await User.findOne({ email });

    // If user doesn't exist, create them
    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        authProvider: 'google',
        // password is not required anymore for google auth
      });
    }

    // Generate JWT tokens
    const jwtAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' },
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' },
    );

    return {
      user,
      accessToken: jwtAccessToken,
      refreshToken,
    };
  }

  static async verifyEmail(token: string) {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    
    await user.save();

    return { message: 'Email verified successfully' };
  }
}