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
        set((state) => {
          // Update the fake backend so direct navigation works
          const mockIdx = MOCK_INVOICES.findIndex(i => i.id === id);
          if (mockIdx >= 0) {
            MOCK_INVOICES[mockIdx].status = status;
            MOCK_INVOICES[mockIdx].paidAt = status === 'Paid' ? new Date().toISOString() : MOCK_INVOICES[mockIdx].paidAt;
          }

          return {
            invoices: state.invoices.map((inv) =>
              inv.id === id
                ? { ...inv, status, paidAt: status === 'Paid' ? new Date().toISOString() : inv.paidAt }
                : inv
            ),
            selectedInvoice:
              state.selectedInvoice?.id === id
                ? { ...state.selectedInvoice, status, paidAt: status === 'Paid' ? new Date().toISOString() : state.selectedInvoice.paidAt }
                : state.selectedInvoice,
          };
        }),

      addInvoice: (invoice) =>
        set((state) => ({ invoices: [invoice, ...state.invoices] })),
    }),
    { name: 'InvoiceStore' }
  )
);
