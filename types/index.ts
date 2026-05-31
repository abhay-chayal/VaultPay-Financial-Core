// ─── Core Domain Types ────────────────────────────────────────────────────────

export type Role = 'admin' | 'client';

export type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue';

export type PaymentStatus = 'idle' | 'loading' | 'success' | 'failed';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  avatarUrl?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientId: string;       // matches UserProfile.uid for access control
  clientEmail: string;
  amount: number;         // in USD cents for safety; display as dollars
  dueDate: string;        // ISO date string
  status: InvoiceStatus;
  createdAt: string;      // ISO date string
  description?: string;
  paidAt?: string;
}

export interface Permission {
  canViewAllInvoices: boolean;
  canCreateInvoice: boolean;
  canDeleteInvoice: boolean;
  canPayInvoice: boolean;
  canDownloadPDF: boolean;
  canViewRevenue: boolean;
  canViewAllClients: boolean;
}

export interface PaymentIntent {
  invoiceId: string;
  amount: number;
  sessionId?: string;
  sessionUrl?: string;
}

// ─── Mock Auth Users (for demo mode) ─────────────────────────────────────────

export interface DemoUser extends UserProfile {
  password: string;
}
