import path from 'path';

import { Resume } from '../../database/models/resume.model.js';

import { ResumeAnalysis } from '../../database/models/resume-analysis.model.js';

import { extractPdfText } from '../../common/utils/pdf-parser.util.js';

import { analyzeResumeText } from '../../common/utils/resume-analyzer.util.js';

import { analyzeResumeWithGemini } from '../../common/utils/gemini.util.js';

export class ResumeService {
  static async uploadResume(
    userId: string,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error(
        'Resume file is required',
      );
    }

    // Save uploaded file metadata
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

    // Absolute path
    const filePath = path.resolve(
      file.path,
    );

    // Extract PDF text
    const extractedText =
      await extractPdfText(filePath);

    // Analyze extracted text
    const basicAnalysis =
      analyzeResumeText(
        extractedText,
      );

    const geminiAnalysis =
      await analyzeResumeWithGemini(
        extractedText,
      );

    // Save full analysis
    const resumeAnalysis =
      await ResumeAnalysis.create({
        userId,

        resumeName:
          file.originalname,

        resumeUrl: file.path,

        extractedText,

        atsScore:
          geminiAnalysis.atsScore ||
          basicAnalysis.atsScore,

        skills: basicAnalysis.skills,

        missingSkills:
          geminiAnalysis.missingSkills || basicAnalysis.missingSkills,

        education:
          basicAnalysis.education,

        experience:
          basicAnalysis.experience,

        projects:
          basicAnalysis.projects,

        suggestions:
          geminiAnalysis.suggestions || basicAnalysis.suggestions,

        summary:
          geminiAnalysis.summary || '',
          
      });

    return {
      resume,

      analysis: resumeAnalysis,
    };
  }
}