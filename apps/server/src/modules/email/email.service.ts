import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const verificationUrl = `${env.CLIENT_URL}/verify?token=${token}`;

    const mailOptions = {
      from: `"SmartHire AI" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Verify your SmartHire AI Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; font-weight: 900; text-transform: uppercase;">Welcome to SmartHire AI!</h2>
          <p style="color: #475569; font-size: 16px;">We are excited to have you on board. To complete your registration, please verify your email address by clicking the button below.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #bef264; color: #0f172a; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; border: 2px solid #0f172a; text-transform: uppercase; display: inline-block;">Verify Email</a>
          </div>
          <p style="color: #475569; font-size: 14px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #3b82f6; font-size: 14px;"><a href="${verificationUrl}">${verificationUrl}</a></p>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 40px;">If you did not sign up for this account, you can safely ignore this email.</p>
        </div>
      `,
    };

    try {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('Email credentials not configured. Verification email was not sent. Check your .env file. Token is:', token);
        return;
      }
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }
}

export const emailService = new EmailService();
