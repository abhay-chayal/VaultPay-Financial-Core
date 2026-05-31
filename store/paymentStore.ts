'use client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PaymentStatus } from '@/types';

interface PaymentState {
  paymentStatus: PaymentStatus;
  processing:    boolean;   // Hard lock — prevents any second click
  lastInvoiceId: string | null;

  startPayment:  (invoiceId: string) => void;
  setSuccess:    () => void;
  setFailed:     () => void;
  resetPayment:  () => void;
}

export const usePaymentStore = create<PaymentState>()(
  devtools(
    (set) => ({
      paymentStatus: 'idle',
      processing:    false,
      lastInvoiceId: null,

      startPayment: (invoiceId) =>
        set({
          paymentStatus: 'loading',
          processing:    true,
          lastInvoiceId: invoiceId,
        }),

      setSuccess: () =>
        set({
          paymentStatus: 'success',
          processing:    false,
        }),

      setFailed: () =>
        set({
          paymentStatus: 'failed',
          processing:    false,
        }),

      resetPayment: () =>
        set({
          paymentStatus: 'idle',
          processing:    false,
          lastInvoiceId: null,
        }),
    }),
    { name: 'PaymentStore' }
  )
);
