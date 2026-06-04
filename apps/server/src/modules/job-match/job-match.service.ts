import { ResumeAnalysis } from '../../database/models/resume-analysis.model.js';

import { JobMatch } from '../../database/models/job-match.model.js';

import { compareResumeWithJob } from '../../common/utils/gemini.util.js';

export class JobMatchService {
  static async matchResume(
    resumeId: string,
    jobDescription: string,
  ) {
    const analysis =
      await ResumeAnalysis.findOne({
        resume: resumeId,
      });

    if (!analysis) {
      throw new Error(
        'Resume analysis not found',
      );
    }

    const result = await compareResumeWithJob(analysis.extractedText, jobDescription);

    const jobMatch =
      await JobMatch.create({
        resume: resumeId,

        jobDescription,

        matchedSkills:
          result.matchedSkills,

        missingSkills:
          result.missingSkills,

        matchScore:
          result.matchScore,
      });

    return jobMatch;
  }
}