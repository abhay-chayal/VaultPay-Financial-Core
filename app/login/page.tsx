'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Shield, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { DEMO_USERS } from '@/lib/mockData';
import { getHomeRoute } from '@/lib/rbac';
import { Spinner } from '@/components/ui/Spinner';
import { RoleBadge } from '@/components/layout/RoleBadge';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));

    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      toast.error('Invalid credentials. Try the demo buttons below.');
      setLoading(false);
      return;
    }

    // Set auth cookie for middleware
    const authData = { state: { user: found, role: found.role } };
    document.cookie = `vaultpay-auth=${encodeURIComponent(JSON.stringify(authData))}; path=/; max-age=86400; SameSite=Strict`;

    setUser(found);
    toast.success(`Welcome back, ${found.displayName}!`, {
      style: { background: '#0F1F3D', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' },
    });
    router.push(getHomeRoute(found.role));
  }

  async function loginAsDemo(uid: string) {
    setLoading(true);
    const user = DEMO_USERS.find((u) => u.uid === uid)!;
    await new Promise((r) => setTimeout(r, 700));

    const authData = { state: { user, role: user.role } };
    document.cookie = `vaultpay-auth=${encodeURIComponent(JSON.stringify(authData))}; path=/; max-age=86400; SameSite=Strict`;

    setUser(user);
    toast.success(`Logged in as ${user.displayName} · ${user.role.toUpperCase()}`, {
      style: { background: '#0F1F3D', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' },
    });
    router.push(getHomeRoute(user.role));
  }

  return (
    <div className="min-h-screen bg-vault-bg flex">
      {/* Left — Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-vault-blue/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-vault-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-blue rounded-xl flex items-center justify-center shadow-glow">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-vault-text font-bold text-lg tracking-wide">VaultPay</p>
            <p className="text-vault-muted text-xs tracking-widest uppercase">Financial Core</p>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-vault-text leading-tight mb-4">
            Enterprise-Grade<br />
            <span className="gradient-text">Financial Security</span>
          </h1>
          <p className="text-vault-subtle text-base leading-relaxed mb-8 max-w-sm">
            Secure invoice management, real-time payments, and role-based access control
            built for modern financial operations.
          </p>

          <div className="space-y-3">
            {[
              'Military-grade 256-bit TLS encryption',
              'Role-based access control (RBAC)',
              'Stripe-powered secure payments',
              'Real-time invoice management',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-vault-subtle text-sm">
                <div className="w-4 h-4 rounded-full bg-vault-green/20 border border-vault-green/40 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-vault-green" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-vault-muted text-xs">
          <Lock className="w-3 h-3" />
          <span>SOC 2 Type II Certified · PCI DSS Compliant</span>
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-blue rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-vault-text font-bold">VaultPay</span>
          </div>

          <h2 className="text-2xl font-bold text-vault-text mb-1">Sign in</h2>
          <p className="text-vault-muted text-sm mb-8">Access your financial portal</p>

          {/* Demo login buttons */}
          <div className="mb-6 p-4 bg-vault-card border border-vault-border rounded-2xl">
            <p className="text-vault-muted text-xs font-semibold uppercase tracking-wider mb-3">
              🚀 Demo Quick Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => loginAsDemo('admin-001')}
                disabled={loading}
                className="
                  flex flex-col items-start p-3 rounded-xl border
                  bg-vault-gold/5 border-vault-gold/30 text-left
                  hover:bg-vault-gold/10 hover:border-vault-gold/50
                  transition-all duration-200 disabled:opacity-50
                "
              >
                <RoleBadge role="admin" size="sm" />
                <p className="text-vault-text text-xs font-semibold mt-1.5">Sarah Mitchell</p>
                <p className="text-vault-muted text-[10px]">admin@vaultpay.io</p>
              </button>
              <button
                onClick={() => loginAsDemo('client-001')}
                disabled={loading}
                className="
                  flex flex-col items-start p-3 rounded-xl border
                  bg-vault-blue/5 border-vault-blue/30 text-left
                  hover:bg-vault-blue/10 hover:border-vault-blue/50
                  transition-all duration-200 disabled:opacity-50
                "
              >
                <RoleBadge role="client" size="sm" />
                <p className="text-vault-text text-xs font-semibold mt-1.5">Alex Thompson</p>
                <p className="text-vault-muted text-[10px]">alex@techcorp.io</p>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-vault-border" />
            <span className="text-vault-muted text-xs">or sign in manually</span>
            <div className="flex-1 h-px bg-vault-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-vault-muted text-xs font-semibold uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-vault-muted" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="
                    w-full bg-vault-surface border border-vault-border rounded-xl
                    pl-10 pr-4 py-3 text-vault-text text-sm
                    focus:outline-none focus:border-vault-blue/60 focus:ring-1 focus:ring-vault-blue/30
                    transition-colors duration-200 placeholder:text-vault-muted
                  "
                />
              </div>
            </div>

            <div>
              <label className="block text-vault-muted text-xs font-semibold uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-vault-muted" />
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="
                    w-full bg-vault-surface border border-vault-border rounded-xl
                    pl-10 pr-12 py-3 text-vault-text text-sm
                    focus:outline-none focus:border-vault-blue/60 focus:ring-1 focus:ring-vault-blue/30
                    transition-colors duration-200 placeholder:text-vault-muted
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-vault-muted hover:text-vault-subtle"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="
                w-full flex items-center justify-center gap-2.5
                px-6 py-3.5 rounded-xl font-semibold text-sm text-white
                bg-gradient-blue shadow-glow
                hover:shadow-[0_0_32px_rgba(37,99,235,0.5)] hover:scale-[1.01]
                active:scale-[0.99] transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2
              "
            >
              {loading ? (
                <><Spinner size="sm" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-vault-muted text-xs">
            Demo passwords: admin → <code className="text-vault-subtle">admin123</code> · client → <code className="text-vault-subtle">client123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
