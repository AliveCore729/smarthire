import { Resume } from '../../database/models/resume.model.js';

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

    return resume;
  }
}