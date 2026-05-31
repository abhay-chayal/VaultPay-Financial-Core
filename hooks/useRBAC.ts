'use client';
import { useAuthStore } from '@/store/authStore';
import { hasPermission, canAccessRoute } from '@/lib/rbac';
import { Permission } from '@/types';

export function useRBAC() {
  const role = useAuthStore((s) => s.role);
  const permissions = useAuthStore((s) => s.permissions);

  return {
    role,
    permissions,
    can: (action: keyof Permission): boolean => {
      if (!role) return false;
      return hasPermission(role, action);
    },
    canRoute: (path: string): boolean => {
      if (!role) return false;
      return canAccessRoute(role, path);
    },
    isAdmin:  role === 'admin',
    isClient: role === 'client',
  };
}
