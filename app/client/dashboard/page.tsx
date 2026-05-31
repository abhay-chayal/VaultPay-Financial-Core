'use client';
import { useInvoices } from '@/hooks/useInvoices';
import { useAuthStore } from '@/store/authStore';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { InvoiceTable } from '@/components/invoices/InvoiceTable';
import { SkeletonLoader, SkeletonCard } from '@/components/ui/SkeletonLoader';
import { RoleBadge } from '@/components/layout/RoleBadge';
import { getClientStats, formatCurrency } from '@/lib/mockData';
import { DollarSign, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ClientDashboardPage() {
  const { invoices, loading } = useInvoices();
  const { user }              = useAuthStore();
  const stats                 = getClientStats(invoices);

  const recent = [...invoices]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-vault-text">My Dashboard</h1>
            <RoleBadge role="client" />
          </div>
          <p className="text-vault-muted text-sm">
            Welcome back, <span className="text-vault-subtle">{user?.displayName}</span>
          </p>
        </div>
        <Link
          href="/client/invoices"
          className="
            flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
            text-vault-subtle border border-vault-border
            hover:border-vault-blue/40 hover:text-vault-text
            transition-all duration-200
          "
        >
          View All Invoices →
        </Link>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Outstanding Balance"
            value={formatCurrency(stats.outstanding)}
            icon={DollarSign}
            color={stats.outstanding > 0 ? 'gold' : 'green'}
            trend={stats.outstanding > 0 ? 'down' : 'neutral'}
            trendLabel={`${invoices.filter(i => i.status !== 'Paid').length} invoices due`}
            glow
          />
          <StatsCard
            title="Total Invoices"
            value={String(stats.count)}
            icon={FileText}
            color="blue"
            trend="neutral"
            trendLabel="All time"
          />
          <StatsCard
            title="Total Paid"
            value={formatCurrency(stats.paidTotal)}
            icon={CheckCircle}
            color="green"
            trend="up"
            trendLabel={`${invoices.filter(i => i.status === 'Paid').length} payments cleared`}
          />
        </div>
      )}

      {/* Recent invoices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-vault-text font-semibold text-lg">Recent Invoices</h2>
          <Link href="/client/invoices" className="text-vault-blue-lt text-sm hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <SkeletonLoader rows={3} />
        ) : (
          <InvoiceTable invoices={recent} />
        )}
      </div>
    </div>
  );
}
