'use client';
import { useInvoices } from '@/hooks/useInvoices';
import { useAuthStore } from '@/store/authStore';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RevenueWidget } from '@/components/dashboard/RevenueWidget';
import { InvoiceTable } from '@/components/invoices/InvoiceTable';
import { SkeletonLoader, SkeletonCard } from '@/components/ui/SkeletonLoader';
import { RoleBadge } from '@/components/layout/RoleBadge';
import { getAdminStats, formatCurrency } from '@/lib/mockData';
import {
  DollarSign, FileText, Clock, Users,
  TrendingUp, AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { invoices, loading } = useInvoices();
  const { user }              = useAuthStore();
  const stats                 = getAdminStats(invoices);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-vault-text">Admin Dashboard</h1>
            <RoleBadge role="admin" />
          </div>
          <p className="text-vault-muted text-sm">
            Welcome back, <span className="text-vault-subtle">{user?.displayName}</span> · Full system access
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
          + New Invoice
        </Link>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats.total)}
            icon={DollarSign}
            color="blue"
            trend="up"
            trendLabel="All invoices"
            glow
          />
          <StatsCard
            title="Collected"
            value={formatCurrency(stats.paid)}
            icon={TrendingUp}
            color="green"
            trend="up"
            trendLabel={`${invoices.filter(i => i.status === 'Paid').length} invoices paid`}
          />
          <StatsCard
            title="Pending"
            value={formatCurrency(stats.pending)}
            icon={Clock}
            color="gold"
            trend="neutral"
            trendLabel={`${invoices.filter(i => i.status === 'Pending').length} awaiting payment`}
          />
          <StatsCard
            title="Overdue"
            value={formatCurrency(stats.overdue)}
            icon={AlertCircle}
            color="red"
            trend="down"
            trendLabel={`${invoices.filter(i => i.status === 'Overdue').length} need attention`}
          />
        </div>
      )}

      {/* Revenue widget */}
      {loading ? (
        <SkeletonCard className="h-52" />
      ) : (
        <RevenueWidget
          total={stats.total}
          paid={stats.paid}
          pending={stats.pending}
          overdue={stats.overdue}
        />
      )}

      {/* Recent invoices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-vault-text font-semibold text-lg">All Invoices</h2>
          <Link href="/admin/invoices" className="text-vault-blue-lt text-sm hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <SkeletonLoader rows={4} />
        ) : (
          <InvoiceTable invoices={invoices} showClient />
        )}
      </div>
    </div>
  );
}
