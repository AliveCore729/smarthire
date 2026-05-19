import mongoose, {
  Schema,
  Document,
} from 'mongoose';

export interface IJobMatch
  extends Document {
  resume:
    | mongoose.Types.ObjectId;

  jobDescription: string;

  matchedSkills: string[];

  missingSkills: string[];

  matchScore: number;
}

const jobMatchSchema =
  new Schema<IJobMatch>(
    {
      resume: {
        type: Schema.Types.ObjectId,
        ref: 'Resume',
        required: true,
      },

      jobDescription: {
        type: String,
        required: true,
      },

      matchedSkills: [
        {
          type: String,
        },
      ],

      missingSkills: [
        {
          type: String,
        },
      ],

      matchScore: {
        type: Number,
        required: true,
      },
    },

    {
      timestamps: true,
    },
  );

export const JobMatch =
  mongoose.model<IJobMatch>(
    'JobMatch',
    jobMatchSchema,
  );