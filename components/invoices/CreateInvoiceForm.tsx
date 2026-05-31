'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Invoice, InvoiceStatus } from '@/types';
import { DEMO_USERS } from '@/lib/mockData';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';

export function CreateInvoiceForm() {
  const router = useRouter();
  const { addInvoice } = useInvoiceStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clients = DEMO_USERS.filter((u) => u.role === 'client');

  const [form, setForm] = useState({
    clientId:    clients[0]?.uid ?? '',
    amount:      '',
    dueDate:     '',
    description: '',
    status:      'Pending' as InvoiceStatus,
  });

  const selectedClient = clients.find((c) => c.uid === form.clientId);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.amount || !form.dueDate || !form.clientId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    const newInvoice: Invoice = {
      id:            `inv-${Date.now()}`,
      invoiceNumber: `VPY-2024-${String(Math.floor(Math.random() * 900) + 100)}`,
      clientId:      form.clientId,
      clientName:    selectedClient?.displayName ?? '',
      clientEmail:   selectedClient?.email ?? '',
      amount:        Math.round(parseFloat(form.amount) * 100),
      dueDate:       form.dueDate,
      status:        form.status,
      createdAt:     new Date().toISOString(),
      description:   form.description,
    };

    addInvoice(newInvoice);
    setIsSubmitting(false);

    toast.success(`Invoice ${newInvoice.invoiceNumber} created successfully!`, {
      style: { background: '#0F1F3D', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' },
    });
    router.push('/admin/invoices');
  }

  return (
    <Card className="max-w-2xl">
      <h2 className="text-vault-text font-semibold text-lg mb-6">Invoice Details</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Client */}
        <div>
          <label className="block text-vault-muted text-xs font-semibold uppercase tracking-wider mb-2">
            Client *
          </label>
          <select
            name="clientId"
            value={form.clientId}
            onChange={handleChange}
            className="
              w-full bg-vault-surface border border-vault-border rounded-xl
              px-4 py-3 text-vault-text text-sm
              focus:outline-none focus:border-vault-blue/60 focus:ring-1 focus:ring-vault-blue/30
              transition-colors duration-200
            "
          >
            {clients.map((c) => (
              <option key={c.uid} value={c.uid} className="bg-vault-surface">
                {c.displayName} ({c.email})
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-vault-muted text-xs font-semibold uppercase tracking-wider mb-2">
            Amount (USD) *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-vault-muted font-semibold">$</span>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              min="1"
              step="0.01"
              placeholder="0.00"
              className="
                w-full bg-vault-surface border border-vault-border rounded-xl
                pl-8 pr-4 py-3 text-vault-text text-sm font-mono
                focus:outline-none focus:border-vault-blue/60 focus:ring-1 focus:ring-vault-blue/30
                transition-colors duration-200
              "
            />
          </div>
        </div>

        {/* Due date + Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-vault-muted text-xs font-semibold uppercase tracking-wider mb-2">
              Due Date *
            </label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="
                w-full bg-vault-surface border border-vault-border rounded-xl
                px-4 py-3 text-vault-text text-sm
                focus:outline-none focus:border-vault-blue/60 focus:ring-1 focus:ring-vault-blue/30
                transition-colors duration-200
              "
            />
          </div>
          <div>
            <label className="block text-vault-muted text-xs font-semibold uppercase tracking-wider mb-2">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="
                w-full bg-vault-surface border border-vault-border rounded-xl
                px-4 py-3 text-vault-text text-sm
                focus:outline-none focus:border-vault-blue/60 focus:ring-1 focus:ring-vault-blue/30
                transition-colors duration-200
              "
            >
              <option value="Pending" className="bg-vault-surface">Pending</option>
              <option value="Paid"    className="bg-vault-surface">Paid</option>
              <option value="Overdue" className="bg-vault-surface">Overdue</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-vault-muted text-xs font-semibold uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Invoice description or service details..."
            className="
              w-full bg-vault-surface border border-vault-border rounded-xl
              px-4 py-3 text-vault-text text-sm resize-none
              focus:outline-none focus:border-vault-blue/60 focus:ring-1 focus:ring-vault-blue/30
              transition-colors duration-200 placeholder:text-vault-muted
            "
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full flex items-center justify-center gap-2.5
            px-6 py-3.5 rounded-xl font-semibold text-sm text-white
            bg-gradient-blue shadow-glow
            hover:shadow-[0_0_32px_rgba(37,99,235,0.5)] hover:scale-[1.01]
            active:scale-[0.99] transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
          "
        >
          {isSubmitting ? (
            <><Spinner size="sm" /> Creating Invoice...</>
          ) : (
            <><PlusCircle className="w-4 h-4" /> Create Invoice</>
          )}
        </button>
      </form>
    </Card>
  );
}
