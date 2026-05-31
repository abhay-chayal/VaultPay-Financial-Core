'use client';
import React from 'react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/mockData';
import { TrendingUp } from 'lucide-react';

interface RevenueWidgetProps {
  total:   number;
  paid:    number;
  pending: number;
  overdue: number;
}

export function RevenueWidget({ total, paid, pending, overdue }: RevenueWidgetProps) {
  const paidPct    = total > 0 ? (paid / total) * 100 : 0;
  const pendingPct = total > 0 ? (pending / total) * 100 : 0;
  const overduePct = total > 0 ? (overdue / total) * 100 : 0;

  return (
    <Card glow className="animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-vault-muted text-xs font-semibold uppercase tracking-wider">Total Revenue Pipeline</p>
          <p className="text-3xl font-bold font-mono text-vault-text mt-1">{formatCurrency(total)}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-blue flex items-center justify-center shadow-glow">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex rounded-full overflow-hidden h-3 bg-vault-border gap-0.5">
          {paidPct > 0 && (
            <div
              className="bg-vault-green transition-all duration-700 ease-out"
              style={{ width: `${paidPct}%` }}
            />
          )}
          {pendingPct > 0 && (
            <div
              className="bg-vault-gold transition-all duration-700 ease-out"
              style={{ width: `${pendingPct}%` }}
            />
          )}
          {overduePct > 0 && (
            <div
              className="bg-vault-red transition-all duration-700 ease-out"
              style={{ width: `${overduePct}%` }}
            />
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Collected',  value: paid,    color: 'bg-vault-green', text: 'text-vault-green' },
          { label: 'Pending',    value: pending,  color: 'bg-vault-gold',  text: 'text-vault-gold' },
          { label: 'Overdue',    value: overdue,  color: 'bg-vault-red',   text: 'text-vault-red' },
        ].map(({ label, value, color, text }) => (
          <div key={label} className="bg-vault-surface rounded-xl p-3 border border-vault-border">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-2 h-2 rounded-full ${color}`} />
              <span className="text-vault-muted text-[10px] font-semibold uppercase tracking-wider">{label}</span>
            </div>
            <p className={`text-sm font-bold font-mono ${text}`}>{formatCurrency(value)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
