import { api } from '@/lib/api';

export interface ResumeUploadResponse {
  success: boolean;
  message: string;
  data: {
    resume: {
      _id: string;
      originalName: string;
      fileName: string;
      filePath: string;
      mimeType: string;
      size: number;
    };
    analysis: {
      skills: string[];
      education: string[];
      experience: any[];
      atsScore: number;
    };
  };
}

export const resumeService = {
  uploadResume: async (file: File) => {
    const formData = new FormData();
    // STRICT BACKEND RULE: Field name must be "resume"
    formData.append("resume", file); 

    const { data } = await api.post<ResumeUploadResponse>('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data;
  }
};