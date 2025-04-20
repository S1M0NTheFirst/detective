'use client';

import { useState, useEffect, type ReactNode, Fragment } from 'react';
import Navbar from '@/components/Navbar';        
import { Upload, PlayCircle } from 'lucide-react';

import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

type TabKey = 'upload' | 'realtime';

export default function SkyVisionPage() {
  const [active, setActive] = useState<TabKey>('upload');

  // Subscribe to new alerts on mount
  useEffect(() => {
    const subscription = supabase
      .from('alerts')
      .on('INSERT', payload => {
        const alert = payload.new;
        toast.success(`🚨 Criminal #${alert.criminal_id} detected!`);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  return (
    <Fragment>
      <Navbar />

      <div className="min-h-screen bg-gray-900 text-green-400 flex flex-col">

        <header className="border-b border-green-600">
          <div className="max-w-6xl mx-auto px-6 py-4 flex gap-8">

            <TabButton
              icon={<Upload className="h-4 w-4" />}
              label="Upload Log"
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
          {active === 'upload'  ? <UploadLogPane /> : null}
          {active === 'realtime' ? <RealtimePane />   : null}
        </main>
      </div>
    </Fragment>
  );
}

function TabButton({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
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
  // demo list of uploads
  const demoFiles = [
    { id: 1, name: 'Camera‑1_2025‑04‑17_1405.mp4', ts: '2025‑04‑17 14:05' },
    { id: 2, name: 'Entrance_CAM_2025‑04‑17_1200.jpg', ts: '2025‑04‑17 12:00' },
    { id: 3, name: 'Lobby_2025‑04‑16_2300.mp4', ts: '2025‑04‑16 23:00' },
  ];

  return (
    <section className="space-y-8">

      {/* upload form */}
      <div className="border border-green-600 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Upload Evidence Feed</h2>

        <label className="block">
          <span className="text-sm text-green-300">Choose file&nbsp;(.jpg / .mp4)</span>
          <input
            type="file"
            className={`block w-full mt-2 text-sm
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:bg-green-700 file:text-white
              hover:file:bg-green-600
              text-green-200`}
          />
        </label>

        <button
          className="mt-4 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 font-medium text-sm"
        >
          Upload
        </button>
      </div>

      {/* recent uploads */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Uploads</h3>
        <ul className="divide-y divide-green-700 border border-green-700 rounded-lg">
          {demoFiles.map(f => (
            <li key={f.id} className="flex justify-between px-4 py-3">
              <span>{f.name}</span>
              <span className="text-xs text-green-300">{f.ts}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RealtimePane() {
  const streamUrl = `${process.env.NEXT_PUBLIC_API_URL}/video_feed`;
  console.log('Stream URL:', streamUrl);

  return (
    <section
      className="
        border border-green-600 rounded-lg
        w-full max-w-3xl h-96 overflow-hidden mx-auto
      "
    >
      <img
        src={streamUrl}
        alt="Live face recognition"
        className="w-full h-full object-cover"
        onError={e => {
          console.error('❌ Image failed to load', e, { streamUrl });
        }}
      />
    </section>
  );
}
