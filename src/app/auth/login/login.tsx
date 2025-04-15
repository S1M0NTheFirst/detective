'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg border border-green-600 shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Secure Access</h2>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-black py-2 rounded-md font-bold hover:bg-green-500 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          New agent? <Link href="/auth/signup" className="underline hover:text-white">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}
