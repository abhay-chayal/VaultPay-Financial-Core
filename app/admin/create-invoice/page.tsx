'use client';
import { CreateInvoiceForm } from '@/components/invoices/CreateInvoiceForm';
import { PlusCircle } from 'lucide-react';

export default function CreateInvoicePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <PlusCircle className="w-6 h-6 text-vault-blue-lt" />
          <h1 className="text-2xl font-bold text-vault-text">Create Invoice</h1>
        </div>
        <p className="text-vault-muted text-sm">
          Generate a new invoice and assign it to a client
        </p>
      </div>
      <CreateInvoiceForm />
    </div>
  );
}
