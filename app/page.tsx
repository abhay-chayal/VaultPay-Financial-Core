'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getHomeRoute } from '@/lib/rbac';
import { Spinner } from '@/components/ui/Spinner';
import { Shield } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, role, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (user && role) {
        router.replace(getHomeRoute(role));
      } else {
        router.replace('/login');
      }
    }
  }, [user, role, isLoading, router]);

  return (
    <div className="min-h-screen bg-vault-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 bg-gradient-blue rounded-2xl flex items-center justify-center shadow-glow">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <Spinner size="md" />
        <p className="text-vault-muted text-sm">Loading VaultPay...</p>
      </div>
    </div>
  );
}
