import mongoose, { Schema, Document } from 'mongoose';

export interface IResumeAnalysis extends Document {
  userId: mongoose.Types.ObjectId;

  resumeName: string;

  resumeUrl: string;

  extractedText: string;

  atsScore: number;

  skills: string[];

  missingSkills: string[];

  experience: string[];

  education: string[];

  projects: string[];

  suggestions: string[];

  summary: string;

  createdAt: Date;

  updatedAt: Date;
}

const ResumeAnalysisSchema =
  new Schema<IResumeAnalysis>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      resumeName: {
        type: String,
        required: true,
      },

      resumeUrl: {
        type: String,
        required: true,
      },

      extractedText: {
        type: String,
        required: true,
      },

      atsScore: {
        type: Number,
        default: 0,
      },

      skills: [
        {
          type: String,
        },
      ],

      missingSkills: [
        {
          type: String,
        },
      ],

      experience: [
        {
          type: String,
        },
      ],

      education: [
        {
          type: String,
        },
      ],

      projects: [
        {
          type: String,
        },
      ],

      suggestions: [
        {
          type: String,
        },
      ],

      summary: {
        type: String,
        default: '',
      },
    },
    {
      timestamps: true,
    },
  );

export const ResumeAnalysis =
  mongoose.model<IResumeAnalysis>(
    'ResumeAnalysis',
    ResumeAnalysisSchema,
  );