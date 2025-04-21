'use client';

import { useState, useEffect, type ReactNode, Fragment } from 'react';
import Navbar from '@/components/Navbar';
import { Upload, PlayCircle } from 'lucide-react';

import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

type TabKey = 'upload' | 'realtime';

export default function SkyVisionPage() {
  const [active, setActive] = useState<TabKey>('upload');

  // Realtime toast subscription
  useEffect(() => {
    console.log("📡 Setting up Supabase Realtime subscription…");

    const channel = supabase
      .channel('public:alerts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alerts' },
        (payload) => {
          console.log('🔔 Realtime payload:', payload);
          toast.success(`🚨 Criminal #${payload.new.criminal_id} detected!`);
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error('❌ Realtime subscribe error:', err);
        } else {
          console.log('✅ Realtime subscription status:', status);
        }
      });

    return () => {
      console.log('📴 Unsubscribing from Supabase Realtime');
      channel.unsubscribe();
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
          {active === 'upload'  && <UploadLogPane />}
          {active === 'realtime' && <RealtimePane />}
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
      {icon}{label}
    </button>
  );
}

function UploadLogPane() {
  // your existing upload UI…
  return (
    <section className="space-y-8">
      {/* … */}
    </section>
  );
}

function RealtimePane() {
  const url = "http://localhost:8000/video_feed";

  return (
    <section
      className="
        border border-green-600 rounded-lg
        w-full max-w-4xl      /* bigger max width */
        h-[480px]             /* fixed height */
        overflow-hidden
        mx-auto
      "
    >
      <img
        src={url}
        alt="Live face recognition"
        className="w-full h-full object-cover"
        onError={e => console.error("MJPEG load error", e)}
      />
    </section>
  );
}



