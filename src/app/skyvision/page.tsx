'use client';

import { useState, useEffect, Fragment } from 'react';
import Navbar from '@/components/Navbar';
import { Upload, PlayCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

type TabKey = 'upload' | 'realtime';

export default function SkyVisionPage() {
  const [active, setActive] = useState<TabKey>('upload');

  return (
    <Fragment>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-green-400 flex flex-col">
        <header className="border-b border-green-600">
          <div className="max-w-6xl mx-auto px-6 py-4 flex gap-8">
            <TabButton
              icon={<Upload className="h-4 w-4" />}
              label="Upload Log"
              isActive={active === 'upload'}
              onClick={() => setActive('upload')}
            />
            <TabButton
              icon={<PlayCircle className="h-4 w-4" />}
              label="Realtime"
              isActive={active === 'realtime'}
              onClick={() => setActive('realtime')}
            />
          </div>
        </header>
        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
          {active === 'upload' && <UploadLogPane />}
          {active === 'realtime' && <RealtimePane />}
        </main>
      </div>
    </Fragment>
  );
}

function TabButton({ icon, label, isActive, onClick }: { icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }) {
  return (
    <button
      onClick={onClick}
      className={
        `
        flex items-center gap-2 text-sm px-3 py-2 rounded-md
        transition-colors
        ${isActive ? 'bg-green-600 text-white' : 'hover:text-white'}
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function UploadLogPane() {
  return (
    <section className="space-y-8">
      {/* …your existing upload UI… */}
    </section>
  );
}

function RealtimePane() {
  const [searchId, setSearchId] = useState<string>('');
  const [watchId, setWatchId] = useState<string | null>(null);

  useEffect(() => {
    if (!watchId) return;

    // Subscribe to alerts for the specific criminal_id
    const channel = supabase
      .channel(`alerts-criminal-${watchId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alerts', filter: `criminal_id=eq.${watchId}` },
        (payload) => {
          const { detected_at, confidence } = payload.new;
          toast.success(
            `🚨 Criminal ${watchId} detected at ${new Date(detected_at).toLocaleTimeString()} (${(confidence * 100).toFixed(1)}%)`
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [watchId]);

  return (
    <section className="space-y-4">
      {/* Search bar for selecting which criminal to watch */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter criminal ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-gray-800 text-green-400 placeholder-green-600 focus:outline-none focus:ring focus:ring-green-600"
        />
        <button
          onClick={() => setWatchId(searchId.trim() || null)}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition"
        >
          Watch
        </button>
      </div>

      {/* Live video feed */}
      <div className="border border-green-600 rounded-lg w-full max-w-4xl h-[480px] overflow-hidden mx-auto">
        <img
          src="http://localhost:8000/video_feed"
          alt="Live face recognition"
          className="w-full h-full object-cover"
          onError={(e) => console.error('MJPEG load error', e)}
        />
      </div>
    </section>
  );
}
