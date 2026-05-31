'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { PERMISSIONS } from '@/lib/rbac';

/**
 * Rehydrates auth state from persisted Zustand storage on mount.
 * In demo mode this is a no-op since localStorage has the user.
 * In production this would listen to onAuthStateChanged.
 */
export function useAuth() {
  const { user, role, permissions, isLoading, setLoading } = useAuthStore();

  useEffect(() => {
    // Mark loading done after hydration check (Zustand persist handles this)
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [setLoading]);

  return { user, role, permissions, isLoading };
}
