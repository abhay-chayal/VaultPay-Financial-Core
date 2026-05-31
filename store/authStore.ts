'use client';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UserProfile, Role } from '@/types';
import { PERMISSIONS } from '@/lib/rbac';
import { Permission } from '@/types';

interface AuthState {
  user:        UserProfile | null;
  role:        Role | null;
  permissions: Permission | null;
  isLoading:   boolean;
  isDemo:      boolean;

  setUser:     (user: UserProfile) => void;
  clearUser:   () => void;
  setLoading:  (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user:        null,
        role:        null,
        permissions: null,
        isLoading:   true,
        isDemo:      false,

        setUser: (user) =>
          set({
            user,
            role:        user.role,
            permissions: PERMISSIONS[user.role],
            isLoading:   false,
            isDemo:      true,
          }),

        clearUser: () =>
          set({
            user:        null,
            role:        null,
            permissions: null,
            isLoading:   false,
            isDemo:      false,
          }),

        setLoading: (v) => set({ isLoading: v }),
      }),
      {
        name: 'vaultpay-auth',
        // Only persist the user object — don't persist loading state
        partialize: (state) => ({
          user:   state.user,
          role:   state.role,
          isDemo: state.isDemo,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);
