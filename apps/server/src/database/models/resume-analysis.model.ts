import mongoose, {
  Schema,
  Document,
} from 'mongoose';

export interface IResumeAnalysis
  extends Document {
  resume: mongoose.Types.ObjectId;

  extractedText: string;

  skills: string[];

  experience: string[];

  education: string[];

  atsScore: number;
}

const resumeAnalysisSchema =
  new Schema<IResumeAnalysis>(
    {
      resume: {
        type: Schema.Types.ObjectId,
        ref: 'Resume',
        required: true,
      },

      extractedText: {
        type: String,
        required: true,
      },

      skills: [
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

      atsScore: {
        type: Number,
        default: 0,
      },
    },

    {
      timestamps: true,
    },
  );

export const ResumeAnalysis =
  mongoose.model<IResumeAnalysis>(
    'ResumeAnalysis',
    resumeAnalysisSchema,
  );