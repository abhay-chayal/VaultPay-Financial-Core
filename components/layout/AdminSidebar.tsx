'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, FileText, PlusCircle, Users,
  LogOut, Shield, TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { RoleBadge } from './RoleBadge';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/admin/dashboard',      label: 'Dashboard',       icon: LayoutDashboard },
  { href: '/admin/invoices',        label: 'All Invoices',    icon: FileText },
  { href: '/admin/create-invoice',  label: 'Create Invoice',  icon: PlusCircle },
];

export function AdminSidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, clearUser } = useAuthStore();

  const handleLogout = () => {
    clearUser();
    document.cookie = 'vaultpay-auth=; path=/; max-age=0';
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <aside className="
      fixed left-0 top-0 h-full w-64 z-40
      bg-vault-surface border-r border-vault-border
      flex flex-col
    ">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-vault-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-blue rounded-xl flex items-center justify-center shadow-glow">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-vault-text font-bold text-sm tracking-wide">VaultPay</p>
            <p className="text-vault-muted text-[10px] tracking-widest uppercase">Financial Core</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-vault-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center">
            <span className="text-vault-bg font-bold text-xs">
              {user?.displayName?.charAt(0) ?? 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-vault-text text-sm font-semibold truncate">{user?.displayName}</p>
            <p className="text-vault-muted text-[10px] truncate">{user?.email}</p>
          </div>
        </div>
        <RoleBadge role="admin" size="sm" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold text-vault-muted tracking-widest uppercase">
          Navigation
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${
                  isActive
                    ? 'bg-vault-blue/20 text-vault-blue-lt border border-vault-blue/30'
                    : 'text-vault-subtle hover:bg-vault-card hover:text-vault-text'
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-vault-blue-lt' : 'text-vault-muted group-hover:text-vault-subtle'}`} />
              {label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-vault-blue-lt" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-vault-border">
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
            text-vault-muted hover:text-vault-red hover:bg-vault-red/10
            transition-all duration-200
          "
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
