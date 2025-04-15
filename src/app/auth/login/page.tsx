'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/bar'); // redirect to your main/dashboard page
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg border border-green-600">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 bg-black border border-green-500 rounded-md"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 bg-black border border-green-500 rounded-md"
          />
          <button className="w-full bg-green-600 text-black py-2 rounded-md font-bold hover:bg-green-500 transition">
            Login
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
}
