'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ClientSidebar } from '@/components/layout/ClientSidebar';
import { Spinner } from '@/components/ui/Spinner';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router  = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-vault-bg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-vault-bg flex">
      <ClientSidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
