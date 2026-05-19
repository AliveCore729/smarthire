import { Resume } from '../../database/models/resume.model.js';

import { ResumeAnalysis } from '../../database/models/resume-analysis.model.js';

import { extractPdfText } from '../../common/utils/pdf-parser.util.js';

import { analyzeResumeText } from '../../common/utils/resume-analyzer.util.js';

export class ResumeService {
  static async uploadResume(
    userId: string,
    file: Express.Multer.File,
  ) {
    const resume =
      await Resume.create({
        user: userId,

        originalName:
          file.originalname,

        fileName: file.filename,

        filePath: file.path,

        mimeType: file.mimetype,

        size: file.size,
      });

    const extractedText =
      await extractPdfText(file.path);

    const analysis =
      analyzeResumeText(
        extractedText,
      );

    const resumeAnalysis =
      await ResumeAnalysis.create({
        resume: resume._id,

        extractedText,

        skills: analysis.skills,

        education:
          analysis.education,

        experience:
          analysis.experience,

        atsScore: analysis.atsScore,
      });

    return {
      resume,
      analysis: resumeAnalysis,
    };
  }
}