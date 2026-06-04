import { Response } from 'express';

import { ResumeService } from './resume.service.js';

import { AuthRequest } from '../../common/middlewares/auth.middleware.js';

import { ResumeAnalysis } from '../../database/models/resume-analysis.model.js';

export class ResumeController {
  static async uploadResume(
    req: AuthRequest,
    res: Response,
    next: import('express').NextFunction
  ) {
    try {
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
        message: 'Resume uploaded successfully',
        data: resume,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getLatestResumeAnalysis(
    req: AuthRequest,
    res: Response,
  ) {
    const latestAnalysis =
      await ResumeAnalysis
        .findOne({
          userId: req.user!.userId,
        })
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: latestAnalysis,
    });
  }
  static async getResumeHistory(
    req: AuthRequest,
    res: Response,
  ) {
    const resumes =
      await ResumeAnalysis.find({
        userId: req.user!.userId,
      })
        .sort({ createdAt: -1 })
        .limit(10);

    return res.status(200).json({
      success: true,
      data: resumes,
    });
  }
}