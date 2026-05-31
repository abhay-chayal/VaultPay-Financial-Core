'use client';
import { useInvoices } from '@/hooks/useInvoices';
import { InvoiceTable } from '@/components/invoices/InvoiceTable';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { FileText } from 'lucide-react';
import Link from 'next/link';

export default function AdminInvoicesPage() {
  const { invoices, loading } = useInvoices();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-vault-text mb-1">Invoice Management</h1>
          <p className="text-vault-muted text-sm">
            {invoices.length} total invoice{invoices.length !== 1 ? 's' : ''} across all clients
          </p>
        </div>
        <Link
          href="/admin/create-invoice"
          className="
            flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white
            bg-gradient-blue shadow-glow hover:shadow-[0_0_24px_rgba(37,99,235,0.5)]
            hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
          "
        >
          <FileText className="w-4 h-4" />
          Create Invoice
        </Link>
      </div>

      {loading ? <SkeletonLoader rows={5} /> : <InvoiceTable invoices={invoices} showClient />}
    </div>
  );
}
