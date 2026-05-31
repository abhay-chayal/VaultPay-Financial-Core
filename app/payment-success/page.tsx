'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowLeft, FileText } from 'lucide-react';

function PaymentSuccessContent() {
  const params  = useSearchParams();
  const invoice = params.get('invoice') ?? 'Unknown';

  return (
    <div className="min-h-screen bg-vault-bg flex items-center justify-center p-6">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-vault-green/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-md animate-slide-up">
        {/* Success icon */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="w-28 h-28 bg-vault-green/10 rounded-full flex items-center justify-center border border-vault-green/20">
              <div className="w-20 h-20 bg-vault-green/15 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-vault-green" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-full border border-vault-green/30 animate-ping opacity-30" />
          </div>
        </div>

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 bg-vault-green/10 border border-vault-green/30 rounded-full px-4 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-vault-green animate-pulse" />
          <span className="text-vault-green text-xs font-bold tracking-wider uppercase">Payment Confirmed</span>
        </div>

        <h1 className="text-3xl font-bold text-vault-text mb-3">Payment Successful!</h1>
        <p className="text-vault-subtle text-base mb-2">
          Your payment has been processed and confirmed.
        </p>
        <p className="text-vault-muted text-sm mb-8">
          Invoice <span className="font-mono text-vault-text font-semibold">{invoice}</span> has been marked as <span className="text-vault-green font-semibold">Paid</span>.
        </p>

        {/* Receipt card */}
        <div className="bg-vault-card border border-vault-border rounded-2xl p-5 mb-8 text-left">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-vault-muted" />
            <span className="text-vault-muted text-xs font-semibold uppercase tracking-wider">Transaction Summary</span>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Status',          value: 'Paid',                   color: 'text-vault-green' },
              { label: 'Invoice Number',  value: invoice,                  color: 'text-vault-text font-mono' },
              { label: 'Payment Method', value: 'Stripe Secure Checkout',  color: 'text-vault-subtle' },
              { label: 'Timestamp',       value: new Date().toLocaleString(), color: 'text-vault-subtle' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-vault-muted">{label}</span>
                <span className={color}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/client/invoices"
            className="
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white
              bg-gradient-blue shadow-glow hover:shadow-[0_0_32px_rgba(37,99,235,0.5)]
              hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
            "
          >
            <FileText className="w-4 h-4" />
            View My Invoices
          </Link>
          <Link
            href="/client/dashboard"
            className="
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
              text-vault-subtle border border-vault-border
              hover:border-vault-blue/40 hover:text-vault-text
              transition-all duration-200
            "
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-vault-bg" />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
