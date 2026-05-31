'use client';
import { useInvoices } from '@/hooks/useInvoices';
import { InvoiceTable } from '@/components/invoices/InvoiceTable';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { FileText } from 'lucide-react';

export default function ClientInvoicesPage() {
  const { invoices, loading } = useInvoices();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <FileText className="w-6 h-6 text-vault-blue-lt" />
          <h1 className="text-2xl font-bold text-vault-text">My Invoices</h1>
        </div>
        <p className="text-vault-muted text-sm">
          {loading ? '—' : `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''} on your account`}
        </p>
      </div>

      {loading ? <SkeletonLoader rows={4} /> : <InvoiceTable invoices={invoices} />}
    </div>
  );
}
