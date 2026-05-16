import mongoose, {
  Schema,
  Document,
} from 'mongoose';

export interface IResume extends Document {
  user: mongoose.Types.ObjectId;

  originalName: string;

  fileName: string;

  filePath: string;

  mimeType: string;

  size: number;
}

const resumeSchema = new Schema<IResume>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

export const Resume =
  mongoose.model<IResume>(
    'Resume',
    resumeSchema,
  );