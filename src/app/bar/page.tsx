'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function MainPage() {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSend = () => {
    console.log('Message:', message);
    console.log('Files:', files);
    // TODO: Send to database or backend
    setMessage('');
    setFiles(null);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <Navbar />
      <main className="p-6 space-y-4 max-w-3xl mx-auto">
        <div className="bg-gray-800 p-4 rounded-lg min-h-[400px] shadow-inner">
          <p className="text-gray-500 text-center">Video Section</p>
        </div>

        <div className="flex flex-col gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full bg-black border border-green-600 p-2 rounded resize-none"
            placeholder="Type a message..."
          />
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="text-white file:bg-green-600 file:border-0 file:py-1 file:px-3 file:rounded file:text-black"
          />
          <button
            onClick={handleSend}
            className="bg-green-600 text-black font-bold py-2 px-4 rounded hover:bg-green-500 w-fit"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
