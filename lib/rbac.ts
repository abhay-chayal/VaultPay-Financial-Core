import { Role, Permission } from '@/types';

// ─── Permission Matrix ─────────────────────────────────────────────────────────

export const PERMISSIONS: Record<Role, Permission> = {
  admin: {
    canViewAllInvoices: true,
    canCreateInvoice:   true,
    canDeleteInvoice:   true,
    canPayInvoice:      false, // admins don't pay — they issue invoices
    canDownloadPDF:     true,
    canViewRevenue:     true,
    canViewAllClients:  true,
  },
  client: {
    canViewAllInvoices: false,
    canCreateInvoice:   false,
    canDeleteInvoice:   false,
    canPayInvoice:      true,
    canDownloadPDF:     true,
    canViewRevenue:     false,
    canViewAllClients:  false,
  },
};

// ─── Route Access Matrix ────────────────────────────────────────────────────────

export const ROUTE_ACCESS: Record<string, Role[]> = {
  '/admin/dashboard':      ['admin'],
  '/admin/invoices':       ['admin'],
  '/admin/create-invoice': ['admin'],
  '/client/dashboard':     ['admin', 'client'],
  '/client/invoices':      ['admin', 'client'],
};

// ─── Utility Helpers ───────────────────────────────────────────────────────────

export function hasPermission(role: Role, action: keyof Permission): boolean {
  return PERMISSIONS[role][action];
}

export function canAccessRoute(role: Role, pathname: string): boolean {
  // Check exact match first
  if (ROUTE_ACCESS[pathname]) {
    return ROUTE_ACCESS[pathname].includes(role);
  }
  // Check prefix match (e.g. /client/invoices/abc)
  if (pathname.startsWith('/admin/') && role !== 'admin') return false;
  return true;
}

export function getHomeRoute(role: Role): string {
  return role === 'admin' ? '/admin/dashboard' : '/client/dashboard';
}
