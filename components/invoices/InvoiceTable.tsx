'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Invoice } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/mockData';
import { ArrowUpDown, Eye, ChevronDown, ChevronUp } from 'lucide-react';

interface InvoiceTableProps {
  invoices:   Invoice[];
  showClient?: boolean;
}

type SortKey = 'invoiceNumber' | 'amount' | 'dueDate' | 'status' | 'createdAt';

export function InvoiceTable({ invoices, showClient = false }: InvoiceTableProps) {
  const [sortKey, setSortKey]   = useState<SortKey>('createdAt');
  const [sortAsc, setSortAsc]   = useState(false);
  const [filter, setFilter]     = useState<string>('All');

  const statuses = ['All', 'Paid', 'Pending', 'Overdue'];

  const filtered = filter === 'All'
    ? invoices
    : invoices.filter((i) => i.status === filter);

  const sorted = [...filtered].sort((a, b) => {
    let va: string | number = a[sortKey] as string | number;
    let vb: string | number = b[sortKey] as string | number;
    if (sortKey === 'amount') { va = a.amount; vb = b.amount; }
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return sortAsc ? cmp : -cmp;
  });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortAsc
      ? <ChevronUp className="w-3 h-3 text-vault-blue-lt" />
      : <ChevronDown className="w-3 h-3 text-vault-blue-lt" />;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`
              px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
              ${
                filter === s
                  ? 'bg-vault-blue/20 text-vault-blue-lt border-vault-blue/40'
                  : 'text-vault-muted border-vault-border hover:border-vault-blue/30 hover:text-vault-subtle'
              }
            `}
          >
            {s}
            <span className="ml-1.5 text-[10px] opacity-60">
              ({s === 'All' ? invoices.length : invoices.filter(i => i.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-vault-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-vault-surface border-b border-vault-border">
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => toggleSort('invoiceNumber')}
                  className="flex items-center gap-1 text-vault-muted text-xs font-semibold uppercase tracking-wider hover:text-vault-subtle"
                >
                  Invoice <SortIcon col="invoiceNumber" />
                </button>
              </th>
              {showClient && (
                <th className="px-4 py-3 text-left text-vault-muted text-xs font-semibold uppercase tracking-wider">
                  Client
                </th>
              )}
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => toggleSort('amount')}
                  className="flex items-center gap-1 text-vault-muted text-xs font-semibold uppercase tracking-wider hover:text-vault-subtle"
                >
                  Amount <SortIcon col="amount" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => toggleSort('dueDate')}
                  className="flex items-center gap-1 text-vault-muted text-xs font-semibold uppercase tracking-wider hover:text-vault-subtle"
                >
                  Due Date <SortIcon col="dueDate" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => toggleSort('status')}
                  className="flex items-center gap-1 text-vault-muted text-xs font-semibold uppercase tracking-wider hover:text-vault-subtle"
                >
                  Status <SortIcon col="status" />
                </button>
              </th>
              <th className="px-4 py-3 text-right text-vault-muted text-xs font-semibold uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-vault-border">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={showClient ? 6 : 5} className="px-4 py-12 text-center text-vault-muted text-sm">
                  No invoices found
                </td>
              </tr>
            ) : (
              sorted.map((inv) => (
                <tr
                  key={inv.id}
                  className="bg-vault-card hover:bg-vault-surface/50 transition-colors duration-150"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-vault-text font-mono font-medium text-sm">{inv.invoiceNumber}</p>
                      <p className="text-vault-muted text-xs mt-0.5 truncate max-w-[180px]">{inv.description}</p>
                    </div>
                  </td>
                  {showClient && (
                    <td className="px-4 py-4 text-vault-subtle text-sm">{inv.clientName}</td>
                  )}
                  <td className="px-4 py-4">
                    <span className="text-vault-text font-semibold font-mono">{formatCurrency(inv.amount)}</span>
                  </td>
                  <td className="px-4 py-4 text-vault-subtle text-sm">{formatDate(inv.dueDate)}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/client/invoices/${inv.id}`}
                      className="
                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                        bg-vault-blue/10 text-vault-blue-lt border border-vault-blue/30
                        hover:bg-vault-blue/20 transition-all duration-200
                      "
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
