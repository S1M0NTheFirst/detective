'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email || null);
    };
    getUser();
  }, []);

  return (
    <nav className="bg-gray-900 text-green-400 p-4 flex justify-between items-center border-b border-green-600">
      <div className="flex space-x-6">
        <Link href="#" className="hover:text-white">Evidence</Link>
        <Link href="/search" className="hover:text-white">Search</Link> 
        <Link href="/about" className="hover:text-white">SkyVersion</Link>
        <Link href="#" className="hover:text-white">Statistic</Link>
      </div>
      <div className="text-sm">{email ? `Logged in as: ${email}` : 'Loading...'}</div>
    </nav>
  );
}
