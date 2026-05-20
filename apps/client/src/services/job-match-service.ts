import { api } from '@/lib/api';

export interface JobMatchRequest {
  resumeId: string;
  jobDescription: string;
}

export interface JobMatchResponse {
  success: boolean;
  message: string;
  data: {
    matchedSkills: string[];
    missingSkills: string[];
    matchScore: number;
  };
}

export const jobMatchService = {
  analyzeMatch: async (payload: JobMatchRequest) => {
    const { data } = await api.post<JobMatchResponse>('/job-match/analyze', payload);
    return data;
  }
};