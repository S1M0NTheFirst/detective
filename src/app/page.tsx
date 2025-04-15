'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <nav className="flex justify-between items-center p-6 border-b border-green-600">
        <h1 className="text-2xl font-bold">Detective</h1>
        <div className="space-x-4">
          <Link href="/auth/login" className="hover:text-white transition">Login</Link>
          <Link href="/auth/signup" className="hover:text-white transition">Sign Up</Link>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center text-center px-4 py-20">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">Welcome to Detective</h2>
        <p className="max-w-xl text-lg text-green-300">
          First tool to help find criminal and solve crime cases
        </p>
      </main>
    </div>
  );
}
