'use client';
import React from 'react';
import { InvoiceStatus } from '@/types';

interface StatusBadgeProps {
  status: InvoiceStatus;
}

const statusConfig: Record<InvoiceStatus, { label: string; classes: string; dot: string }> = {
  Paid: {
    label:   'Paid',
    classes: 'bg-vault-green/10 text-vault-green border border-vault-green/30',
    dot:     'bg-vault-green',
  },
  Pending: {
    label:   'Pending',
    classes: 'bg-vault-gold/10 text-vault-gold border border-vault-gold/30',
    dot:     'bg-vault-gold',
  },
  Overdue: {
    label:   'Overdue',
    classes: 'bg-vault-red/10 text-vault-red border border-vault-red/30',
    dot:     'bg-vault-red',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse-slow`} />
      {cfg.label}
    </span>
  );
}
