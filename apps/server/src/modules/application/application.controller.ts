import { Request, Response, NextFunction } from 'express';
import { Application } from '../../database/models/application.model.js';
import { AppError } from '../../common/errors/app-error.js';

interface AuthRequest extends Request {
  user?: { userId: string };
}

export class ApplicationController {
  static async getApplications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const applications = await Application.find({ user: req.user?.userId }).sort({ dateApplied: -1 });
      res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createApplication(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { company, role, status, matchScore, dateApplied } = req.body;
      
      if (!company || !role) {
        throw new AppError('Company and role are required', 400);
      }

      const application = await Application.create({
        user: req.user?.userId,
        company,
        role,
        status: status || 'applied',
        matchScore: matchScore || 0,
        dateApplied: dateApplied || Date.now()
      });

      res.status(201).json({
        success: true,
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateApplicationStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        throw new AppError('Status is required', 400);
      }

      const application = await Application.findOneAndUpdate(
        { _id: id, user: req.user?.userId },
        { status },
        { new: true, runValidators: true }
      );

      if (!application) {
        throw new AppError('Application not found', 404);
      }

      res.status(200).json({
        success: true,
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteApplication(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const application = await Application.findOneAndDelete({
        _id: id,
        user: req.user?.userId,
      });

      if (!application) {
        throw new AppError('Application not found', 404);
      }

      res.status(200).json({
        success: true,
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }
}
