'use client';
import { useEffect } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useAuthStore } from '@/store/authStore';

export function useInvoices() {
  const { invoices, loading, selectedInvoice, fetchInvoices, selectInvoice, updateInvoiceStatus } =
    useInvoiceStore();
  const { user, role } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    // Admin sees all; client sees only their own
    const clientId = role === 'client' ? user.uid : undefined;
    fetchInvoices(clientId);
  }, [user, role, fetchInvoices]);

  return { invoices, loading, selectedInvoice, selectInvoice, updateInvoiceStatus };
}
