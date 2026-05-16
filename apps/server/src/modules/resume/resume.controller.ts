import { Response } from 'express';

import { ResumeService } from './resume.service.js';

import { AuthRequest } from '../../common/middlewares/auth.middleware.js';

export class ResumeController {
  static async uploadResume(
    req: AuthRequest,
    res: Response,
  ) {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const resume =
      await ResumeService.uploadResume(
        req.user!.userId,
        req.file,
      );

    return res.status(201).json({
      success: true,
      message:
        'Resume uploaded successfully',

      data: resume,
    });
  }
}