import { create } from 'zustand';

import {
  authService,
  User,
} from '@/services/auth-service';

import {
  resumeService,
  ResumeUploadResponse,
} from '@/services/resume-service';

interface AuthState {
  user: User | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  error: string | null;

  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;

  resume:
  | ResumeUploadResponse['data']
  | null;

  login: (
    credentials: Record<
      string,
      string
    >,
  ) => Promise<void>;

  register: (
    userData: Record<
      string,
      string
    >,
  ) => Promise<void>;

  loginWithGoogle: (
    token: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  checkAuth: () => Promise<void>;

  updateProfile: (
    userData: Partial<User>,
  ) => Promise<void>;

  uploadResume: (
    file: File,
  ) => Promise<void>;

  loadResume: () => Promise<void>;

  resumeHistory: any[];

  loadResumeHistory: () => Promise<void>;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    user: null,

    isAuthenticated: false,

    isLoading: true,

    error: null,

    avatarUrl: null,

    setAvatarUrl: (url) => set({ avatarUrl: url }),

    resume: null,

    resumeHistory: [],

    login: async (
      credentials,
    ) => {
      try {
        set({
          isLoading: true,
          error: null,
        });

        const response =
          await authService.login(
            credentials,
          );

        set({
          user: response.data,

          isAuthenticated: true,

          isLoading: false,
        });
      } catch (error: any) {
        set({
          error:
            error.response?.data
              ?.message ||
            'Login failed',

          isLoading: false,
        });

        throw error;
      }
    },

    register: async (
      userData,
    ) => {
      try {
        set({
          isLoading: true,
          error: null,
        });

        const response =
          await authService.register(
            userData,
          );

        set({
          user: response.data,

          isAuthenticated: true,

          isLoading: false,
        });
      } catch (error: any) {
        set({
          error:
            error.response?.data
              ?.message ||
            'Registration failed',

          isLoading: false,
        });

        throw error;
      }
    },

    loginWithGoogle: async (
      token: string,
    ) => {
      try {
        set({
          isLoading: true,
          error: null,
        });

        const response =
          await authService.googleLogin(
            token,
          );

        set({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error: any) {
        let errorMessage = error.response?.data?.message || 'Google login failed';
        if (errorMessage.length > 50) {
          errorMessage = 'Authentication failed. Please try again.';
        }
        
        set({
          error: errorMessage,
          isLoading: false,
        });
        throw error;
      }
    },

    updateProfile: async (
      userData,
    ) => {
      try {
        set({
          isLoading: true,
          error: null,
        });

        const response =
          await authService.updateProfile(
            userData,
          );

        set({
          user: response.data,
          isLoading: false,
        });
      } catch (error: any) {
        set({
          error:
            error.response?.data
              ?.message ||
            'Profile update failed',
          isLoading: false,
        });
        throw error;
      }
    },

    logout: async () => {
      try {
        await authService.logout();

        set({
          user: null,

          resume: null,

          isAuthenticated: false,

          isLoading: false,

          error: null,
        });
      } catch (error) {
        console.error(
          'Logout failed',
          error,
        );

        set({
          user: null,

          resume: null,

          isAuthenticated: false,

          isLoading: false,
        });
      }
    },

    checkAuth: async () => {
      try {
        const response =
          await authService.getCurrentUser();

        set({
          user: response.data,

          isAuthenticated: true,

          isLoading: false,
        });
      } catch (error) {
        set({
          user: null,

          resume: null,

          isAuthenticated: false,

          isLoading: false,
        });
      }
    },

    uploadResume: async (
      file,
    ) => {
      try {
        set({
          isLoading: true,
          error: null,
        });

        const response =
          await resumeService.uploadResume(
            file,
          );

        set({
          resume: response.data,

          isLoading: false,
        });
      } catch (error: any) {
        set({
          error:
            error.response?.data
              ?.message ||
            'Resume upload failed',

          isLoading: false,
        });

        throw error;
      }
    },

    loadResume: async () => {
      try {
        const response =
          await resumeService.getLatestResume();

        if (response.data) {
          set({
            resume: {
              analysis: response.data,
            } as any,
          });
        }
      } catch (error) {
        console.error(
          'Failed to load resume',
          error,
        );
      }
    },
    loadResumeHistory: async () => {
      try {
        const response =
          await resumeService.getResumeHistory();

        set({
          resumeHistory:
            response.data || [],
        });
      } catch (error) {
        console.error(
          'Failed to load resume history',
          error,
        );
      }
    },
  }));