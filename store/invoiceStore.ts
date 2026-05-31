'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Invoice, InvoiceStatus } from '@/types';
import { MOCK_INVOICES } from '@/lib/mockData';

interface InvoiceState {
  invoices:        Invoice[];
  loading:         boolean;
  selectedInvoice: Invoice | null;

  fetchInvoices:      (clientId?: string) => Promise<void>;
  selectInvoice:      (invoice: Invoice | null) => void;
  updateInvoiceStatus:(id: string, status: InvoiceStatus) => void;
  addInvoice:         (invoice: Invoice) => void;
}

export const useInvoiceStore = create<InvoiceState>()(
  devtools(
    (set, get) => ({
      invoices:        [],
      loading:         false,
      selectedInvoice: null,

      fetchInvoices: async (clientId?: string) => {
        set({ loading: true });
        // Simulate network latency for realistic UX
        await new Promise((r) => setTimeout(r, 800));
        const all = MOCK_INVOICES;
        const filtered = clientId
          ? all.filter((inv) => inv.clientId === clientId)
          : all;
        set({ invoices: filtered, loading: false });
      },

      selectInvoice: (invoice) => set({ selectedInvoice: invoice }),

      updateInvoiceStatus: (id, status) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id
              ? { ...inv, status, paidAt: status === 'Paid' ? new Date().toISOString() : inv.paidAt }
              : inv
          ),
          selectedInvoice:
            state.selectedInvoice?.id === id
              ? { ...state.selectedInvoice, status }
              : state.selectedInvoice,
        })),

      addInvoice: (invoice) =>
        set((state) => ({ invoices: [invoice, ...state.invoices] })),
    }),
    { name: 'InvoiceStore' }
  )
);
