import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../../domain/user/User';
import { LoginCredentials, RegisterData } from '../../domain/auth/AuthService';
import { CreateUserData } from '../../domain/user/User';
import { SupabaseAuthService } from '../../infrastructure/supabase/SupabaseAuthService';
import { LoginUser } from '../../application/auth/LoginUser';
import { RegisterUser } from '../../application/auth/RegisterUser';
import { LogoutUser } from '../../application/auth/LogoutUser';
import { GetCurrentUser } from '../../application/auth/GetCurrentUser';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: CreateUserData) => Promise<void>;
  registerLegacy: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Dependency injection - create service instances
const authService = new SupabaseAuthService();
const loginUser = new LoginUser(authService);
const registerUser = new RegisterUser(authService);
const logoutUser = new LogoutUser(authService);
const getCurrentUser = new GetCurrentUser(authService);

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await loginUser.execute(credentials);
          set({
            isAuthenticated: true,
            user: result.user,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed'
          });
          throw error;
        }
      },
      
      register: async (userData: CreateUserData) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await registerUser.execute(userData);
          set({
            isAuthenticated: true,
            user: result.user,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed'
          });
          throw error;
        }
      },
      
      registerLegacy: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await registerUser.executeLegacy(data);
          set({
            isAuthenticated: true,
            user: result.user,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed'
          });
          throw error;
        }
      },
      
      logout: async () => {
        set({ isLoading: true, error: null });
        
        try {
          await logoutUser.execute();
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Logout failed'
          });
        }
      },
      
      getCurrentUser: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await getCurrentUser.execute();
          set({
            isAuthenticated: !!user,
            user,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to get current user'
          });
        }
      },
      
      refreshUser: async () => {
        if (!get().isAuthenticated) return;
        
        set({ isLoading: true, error: null });
        
        try {
          const user = await getCurrentUser.execute();
          set({
            isAuthenticated: !!user,
            user,
            isLoading: false,
            error: null
          });
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to refresh user data'
          });
        }
      },
      
      setUser: (user: User) => {
        set({
          isAuthenticated: true,
          user,
          error: null
        });
      },
      
      clearError: () => set({ error: null }),
      
      setLoading: (loading: boolean) => set({ isLoading: loading })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user
      })
    }
  )
);
