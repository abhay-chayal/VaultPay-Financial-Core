'use client';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { usePaymentStore } from '@/store/paymentStore';
import { useInvoiceStore } from '@/store/invoiceStore';
import { getStripe } from '@/lib/stripe';
import { Invoice } from '@/types';
import { Spinner } from '@/components/ui/Spinner';

interface PayButtonProps {
  invoice: Invoice;
}

export function PayButton({ invoice }: PayButtonProps) {
  const router = useRouter();
  const { paymentStatus, processing, startPayment, setSuccess, setFailed, resetPayment } =
    usePaymentStore();
  const { updateInvoiceStatus } = useInvoiceStore();

  const isDisabled = processing || invoice.status === 'Paid';

  const handlePayment = useCallback(async () => {
    // ── CRITICAL SAFETY CHECK — Hard lock prevents double submission ──────────
    if (processing || invoice.status === 'Paid') return;

    startPayment(invoice.id);

    const toastId = toast.loading('Payment Processing...', {
      style: { background: '#0F1F3D', color: '#E2E8F0', border: '1px solid #1E3A5F' },
    });

    try {
      // ── Try real Stripe Checkout first ─────────────────────────────────────
      const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

      if (stripeKey && stripeKey !== '' && !stripeKey.includes('your_')) {
        const res = await fetch('/api/create-checkout-session', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invoiceId:    invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            amount:       invoice.amount,
            clientEmail:  invoice.clientEmail,
            description:  invoice.description,
          }),
        });

        if (!res.ok) throw new Error('Checkout session failed');
        const { url } = await res.json();

        toast.dismiss(toastId);
        window.location.href = url;
        return;
      }

      // ── Demo mode: simulate payment flow ──────────────────────────────────
      await new Promise((r) => setTimeout(r, 2000));

      // 90% success rate in demo
      const success = Math.random() > 0.1;

      if (success) {
        setSuccess();
        updateInvoiceStatus(invoice.id, 'Paid');
        toast.success('Payment Successful! Invoice marked as paid.', {
          id: toastId,
          duration: 4000,
          style: {
            background: '#0F1F3D',
            color: '#10B981',
            border: '1px solid rgba(16,185,129,0.3)',
          },
          icon: '✅',
        });
        setTimeout(() => {
          router.push('/payment-success?invoice=' + invoice.invoiceNumber);
        }, 1500);
      } else {
        throw new Error('Payment declined by bank');
      }
    } catch (err: unknown) {
      setFailed();
      const message = err instanceof Error ? err.message : 'Payment failed. Please try again.';
      toast.error(`Payment Failed: ${message}`, {
        id: toastId,
        duration: 5000,
        style: {
          background: '#0F1F3D',
          color: '#EF4444',
          border: '1px solid rgba(239,68,68,0.3)',
        },
        icon: '❌',
      });
      // Auto-reset after failure so user can retry
      setTimeout(() => resetPayment(), 3000);
    }
  }, [invoice, processing, startPayment, setSuccess, setFailed, resetPayment, updateInvoiceStatus, router]);

  if (invoice.status === 'Paid') {
    return (
      <div className="
        flex items-center gap-2 px-6 py-3 rounded-xl
        bg-vault-green/10 border border-vault-green/30 text-vault-green
        font-semibold text-sm
      ">
        <CheckCircle className="w-4 h-4" />
        Invoice Paid
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        id="pay-invoice-btn"
        onClick={handlePayment}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={`
          relative flex items-center justify-center gap-2.5
          px-8 py-3.5 rounded-xl font-semibold text-sm
          transition-all duration-200 select-none
          ${
            isDisabled
              ? 'bg-vault-card border border-vault-border text-vault-muted cursor-not-allowed opacity-60'
              : 'bg-gradient-blue text-white shadow-glow hover:shadow-[0_0_32px_rgba(37,99,235,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
          }
        `}
      >
        {paymentStatus === 'loading' ? (
          <>
            <Spinner size="sm" />
            <span>Processing Payment...</span>
          </>
        ) : paymentStatus === 'failed' ? (
          <>
            <XCircle className="w-4 h-4 text-vault-red" />
            <span className="text-vault-red">Payment Failed — Retry</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>Pay Invoice</span>
          </>
        )}
      </button>

      {/* Security notice */}
      {!isDisabled && (
        <p className="text-vault-muted text-[11px] text-center flex items-center justify-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secured by Stripe · 256-bit TLS encryption
        </p>
      )}
    </div>
  );
}
