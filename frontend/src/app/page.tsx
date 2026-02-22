'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // For now, redirect to login
    router.push('/login');
  }, [router]);

  return (
    <div style={{ background: '#0a0c10', height: '100vh', display: 'flex', alignItems: 'center', justifySelf: 'center' }}>
      <p style={{ color: '#00ff88', fontWeight: 600 }}>Loading BeFin...</p>
    </div>
  );
}
