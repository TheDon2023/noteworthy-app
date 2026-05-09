import type { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LandingPage from '@/pages/LandingPage';

export default function AuthGate({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0f1929] to-[#1a2744] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-[#c9a84c]/20 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return <>{children}</>;
}
