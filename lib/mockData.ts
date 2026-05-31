import { Invoice, DemoUser } from '@/types';

// ─── Demo Users ───────────────────────────────────────────────────────────────

export const DEMO_USERS: DemoUser[] = [
  {
    uid:         'admin-001',
    email:       'admin@vaultpay.io',
    displayName: 'Sarah Mitchell',
    role:        'admin',
    password:    'admin123',
    avatarUrl:   '',
  },
  {
    uid:         'client-001',
    email:       'alex@techcorp.io',
    displayName: 'Alex Thompson',
    role:        'client',
    password:    'client123',
    avatarUrl:   '',
  },
  {
    uid:         'client-002',
    email:       'maria@designstudio.io',
    displayName: 'Maria Santos',
    role:        'client',
    password:    'client456',
    avatarUrl:   '',
  },
];

// ─── Mock Invoices ────────────────────────────────────────────────────────────

export const MOCK_INVOICES: Invoice[] = [
  {
    id:            'inv-001',
    invoiceNumber: 'VPY-2024-001',
    clientName:    'Alex Thompson',
    clientId:      'client-001',
    clientEmail:   'alex@techcorp.io',
    amount:        500000,   // $5,000.00
    dueDate:       '2024-06-15',
    status:        'Paid',
    createdAt:     '2024-05-01T10:00:00Z',
    paidAt:        '2024-05-28T14:23:00Z',
    description:   'Q1 Software Development Services — Sprint 1–4',
  },
  {
    id:            'inv-002',
    invoiceNumber: 'VPY-2024-002',
    clientName:    'Alex Thompson',
    clientId:      'client-001',
    clientEmail:   'alex@techcorp.io',
    amount:        1200000,  // $12,000.00
    dueDate:       '2024-07-01',
    status:        'Pending',
    createdAt:     '2024-06-01T09:00:00Z',
    description:   'Platform Architecture & Cloud Infrastructure Setup',
  },
  {
    id:            'inv-003',
    invoiceNumber: 'VPY-2024-003',
    clientName:    'Alex Thompson',
    clientId:      'client-001',
    clientEmail:   'alex@techcorp.io',
    amount:        2500000,  // $25,000.00
    dueDate:       '2024-05-01',
    status:        'Overdue',
    createdAt:     '2024-04-01T08:00:00Z',
    description:   'Enterprise Security Audit & Compliance Implementation',
  },
  {
    id:            'inv-004',
    invoiceNumber: 'VPY-2024-004',
    clientName:    'Maria Santos',
    clientId:      'client-002',
    clientEmail:   'maria@designstudio.io',
    amount:        4800000,  // $48,000.00
    dueDate:       '2024-08-01',
    status:        'Pending',
    createdAt:     '2024-07-01T11:00:00Z',
    description:   'Annual Brand Identity & Design System Contract',
  },
  {
    id:            'inv-005',
    invoiceNumber: 'VPY-2024-005',
    clientName:    'Maria Santos',
    clientId:      'client-002',
    clientEmail:   'maria@designstudio.io',
    amount:        800000,   // $8,000.00
    dueDate:       '2024-06-20',
    status:        'Paid',
    createdAt:     '2024-05-20T14:00:00Z',
    paidAt:        '2024-06-18T09:45:00Z',
    description:   'UI/UX Redesign — Mobile Application Phase 1',
  },
  {
    id:            'inv-006',
    invoiceNumber: 'VPY-2024-006',
    clientName:    'Maria Santos',
    clientId:      'client-002',
    clientEmail:   'maria@designstudio.io',
    amount:        1500000,  // $15,000.00
    dueDate:       '2024-04-15',
    status:        'Overdue',
    createdAt:     '2024-03-15T10:00:00Z',
    description:   'Marketing Collateral & Campaign Asset Production',
  },
  {
    id:            'inv-007',
    invoiceNumber: 'VPY-2024-007',
    clientName:    'Alex Thompson',
    clientId:      'client-001',
    clientEmail:   'alex@techcorp.io',
    amount:        3200000,  // $32,000.00
    dueDate:       '2024-09-01',
    status:        'Pending',
    createdAt:     '2024-08-01T09:00:00Z',
    description:   'AI Integration & ML Model Deployment Services',
  },
  {
    id:            'inv-008',
    invoiceNumber: 'VPY-2024-008',
    clientName:    'Maria Santos',
    clientId:      'client-002',
    clientEmail:   'maria@designstudio.io',
    amount:        950000,   // $9,500.00
    dueDate:       '2024-07-15',
    status:        'Paid',
    createdAt:     '2024-06-15T13:00:00Z',
    paidAt:        '2024-07-10T11:00:00Z',
    description:   'Video Production & Motion Graphics Package',
  },
];

// ─── Utility: Format currency from cents ──────────────────────────────────────

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  });
}

// ─── Aggregate Stats ─────────────────────────────────────────────────────────

export function getAdminStats(invoices: Invoice[]) {
  const total   = invoices.reduce((s, i) => s + i.amount, 0);
  const paid    = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amount, 0);
  const overdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0);
  return { total, paid, pending, overdue, count: invoices.length };
}

export function getClientStats(invoices: Invoice[]) {
  const outstanding = invoices
    .filter(i => i.status !== 'Paid')
    .reduce((s, i) => s + i.amount, 0);
  const paidTotal = invoices
    .filter(i => i.status === 'Paid')
    .reduce((s, i) => s + i.amount, 0);
  return { outstanding, paidTotal, count: invoices.length };
}
