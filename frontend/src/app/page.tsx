'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // For now, redirect to login
    router.push('/login');
  }, [router]);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0b] items-center justify-center selection:bg-blue-500/30 gap-6">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-150"></div>
        <div className="relative w-16 h-16 bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
          <Image src="/images/logo.png" alt="BeFin" width={32} height={32} className="animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-blue-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p className="font-bold tracking-wide">Loading...</p>
        </div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Preparing your experience</p>
      </div>
    </div>
  );
}
