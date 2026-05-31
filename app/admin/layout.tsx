'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Spinner } from '@/components/ui/Spinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router  = useRouter();
  const { user, role, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace('/login');
      } else if (role !== 'admin') {
        router.replace('/403');
      }
    }
  }, [user, role, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-vault-bg flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-vault-bg flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
