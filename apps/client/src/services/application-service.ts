import { api } from '@/lib/api';

export interface ApplicationData {
  _id: string;
  company: string;
  role: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';
  matchScore: number;
  dateApplied: string;
}

export const applicationService = {
  getApplications: async () => {
    const response = await api.get('/applications');
    return response.data;
  },

  createApplication: async (data: Partial<ApplicationData>) => {
    const response = await api.post('/applications', data);
    return response.data;
  },

  updateApplicationStatus: async (id: string, status: string) => {
    const response = await api.patch(`/applications/${id}/status`, { status });
    return response.data;
  },

  deleteApplication: async (id: string) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  }
};
