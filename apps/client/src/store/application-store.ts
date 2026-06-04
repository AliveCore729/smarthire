import { create } from 'zustand';
import { applicationService, ApplicationData } from '@/services/application-service';

interface ApplicationState {
  applications: ApplicationData[];
  isLoading: boolean;
  error: string | null;

  loadApplications: () => Promise<void>;
  createApplication: (data: Partial<ApplicationData>) => Promise<void>;
  updateApplicationStatus: (id: string, status: ApplicationData['status']) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  
  // Optimistic update helper
  moveApplicationLocal: (id: string, newStatus: ApplicationData['status']) => void;
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: [],
  isLoading: false,
  error: null,

  loadApplications: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await applicationService.getApplications();
      set({ applications: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to load applications', isLoading: false });
    }
  },

  createApplication: async (data) => {
    try {
      const response = await applicationService.createApplication(data);
      set((state) => ({ applications: [response.data, ...state.applications] }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to create application' });
      throw error;
    }
  },

  updateApplicationStatus: async (id, status) => {
    try {
      // Optimistic update is usually done before, but here we just wait for API or do it locally
      await applicationService.updateApplicationStatus(id, status);
      set((state) => ({
        applications: state.applications.map(app => app._id === id ? { ...app, status } : app)
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to update application status' });
      // Re-fetch to sync if failed
      get().loadApplications();
    }
  },

  deleteApplication: async (id) => {
    try {
      await applicationService.deleteApplication(id);
      set((state) => ({
        applications: state.applications.filter(app => app._id !== id)
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to delete application' });
    }
  },

  moveApplicationLocal: (id, newStatus) => {
    set((state) => ({
      applications: state.applications.map(app => app._id === id ? { ...app, status: newStatus } : app)
    }));
  }
}));
