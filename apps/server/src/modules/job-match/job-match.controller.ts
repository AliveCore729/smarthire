import {
  Request,
  Response,
} from 'express';

import { JobMatchService } from './job-match.service.js';

export class JobMatchController {
  static async matchResume(
    req: Request,
    res: Response,
  ) {
    const {
      resumeId,
      jobDescription,
    } = req.body;

    const result =
      await JobMatchService.matchResume(
        resumeId,
        jobDescription,
      );

    return res.status(200).json({
      success: true,
      message:
        'Job match analysis completed',

      data: result,
    });
  }
}