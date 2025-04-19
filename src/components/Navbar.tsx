
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const pathname = usePathname();                

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setEmail(session?.user.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { label: 'Evidence',  href: '/evidence' },
    { label: 'Search',    href: '/search' },
    { label: 'SkyVision', href: '/skyvision' },
    { label: 'Statistic', href: '/statistics' },
  ];

  return (
    <nav className="bg-gray-900 text-green-400 p-4 flex justify-between items-center border-b border-green-600">
      {/* left side links */}
      <ul className="flex space-x-6">
        {navItems.map(item => {
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  hover:text-white transition-colors
                  ${active ? 'text-white font-semibold' : ''}
                `}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <span className="text-sm">
        {email ? `Logged in as: ${email}` : 'Loading…'}
      </span>
    </nav>
  );
}
