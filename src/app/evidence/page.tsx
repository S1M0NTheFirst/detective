
'use client';

import { useState, useMemo, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Search, Edit3 } from 'lucide-react';

type Case = { id: number; name: string; };
type Evidence = { id: number; case_id: number; type: 'image' | 'video' | 'note'; url?: string; description?: string; };

const DEMO_CASES: Case[] = [
  { id: 101, name: 'Bank Robbery – Downtown' },
  { id: 102, name: 'Diamond Heist – Museum' },
  { id: 103, name: 'Cyber Fraud Operation' },
  { id: 104, name: 'Arson at Pine St. Warehouse' },
];

const DEMO_EVIDENCE: Evidence[] = [
  { id: 1,  case_id: 101, type: 'image', url: 'https://picsum.photos/seed/101/600/350' },
  { id: 2,  case_id: 101, type: 'note',  description: 'Blue sedan spotted leaving the scene at 14:05.' },
  { id: 3,  case_id: 102, type: 'video', url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' },
  { id: 4,  case_id: 102, type: 'note',  description: 'Glass cutter fragments found near vault door.' },
  { id: 5,  case_id: 103, type: 'note',  description: 'Server logs indicate SQL injection vector.' },
  { id: 6,  case_id: 104, type: 'image', url: 'https://picsum.photos/seed/104/600/350' },
];

/* ---------- main page ---------- */
export default function EvidencePage() {
  const [cases, setCases]       = useState<Case[]>(DEMO_CASES);
  const [query, setQuery]       = useState('');
  const [selected, setSelected] = useState<Case | null>(null);

  /* client‑side filtering */
  const filtered = useMemo(
    () =>
      cases.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.id.toString().includes(query.trim()),
      ),
    [query, cases],
  );

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-neutral-100">
      {/* header */}
      <header className="w-full px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Evidence Vault (Demo)</h1>

        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by Case ID or name…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full rounded-lg bg-neutral-800 pl-10 pr-4 py-2 outline-none
                       focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </header>

      {/* case grid */}
      <section className="flex-1 px-6 pb-10 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-neutral-400 mt-10 text-center">No matching cases.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(c => (
              <li key={c.id}>
                <button
                  onClick={() => setSelected(c)}
                  className="w-full h-40 rounded-xl bg-neutral-800 hover:bg-neutral-700
                             flex flex-col justify-center items-center gap-2 shadow-md
                             transition-colors"
                >
                  <span className="text-sm text-neutral-400">Case #{c.id}</span>
                  <span className="text-lg font-medium">{c.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* modal */}
      {selected && (
        <EvidenceModal
          caseItem={selected}
          evidence={DEMO_EVIDENCE.filter(e => e.case_id === selected.id)}
          onClose={() => setSelected(null)}
          onNameChange={newName =>
            setCases(cs => cs.map(c => (c.id === selected.id ? { ...c, name: newName } : c)))
          }
        />
      )}
    </div>
  );
}

function EvidenceModal({
  caseItem,
  evidence,
  onClose,
  onNameChange,
}: {
  caseItem: Case;
  evidence: Evidence[];
  onClose: () => void;
  onNameChange: (newName: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(caseItem.name);

  const save = () => {
    if (tempName.trim()) {
      onNameChange(tempName.trim());
      setEditing(false);
    }
  };

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150"  leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"  leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-neutral-900 p-6 shadow-xl">
              {/* header */}
              <div className="flex items-center justify-between mb-6">
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={tempName}
                      onChange={e => setTempName(e.target.value)}
                      className="bg-neutral-800 px-3 py-1 rounded-md outline-none
                                 focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      onClick={save}
                      className="text-sm px-3 py-1 rounded-md bg-cyan-600 hover:bg-cyan-700"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <Dialog.Title className="text-xl font-medium">
                    {caseItem.name}
                  </Dialog.Title>
                )}

                <button onClick={() => setEditing(!editing)} className="p-2 rounded-md hover:bg-neutral-800">
                  <Edit3 className="h-5 w-5" />
                </button>
              </div>

              {/* evidence list */}
              {evidence.length === 0 ? (
                <p className="text-neutral-400">No evidence for this demo case.</p>
              ) : (
                <ul className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                  {evidence.map(ev => (
                    <li key={ev.id} className="border border-neutral-700 rounded-lg p-4">
                      <p className="text-sm text-neutral-400 mb-2">
                        #{ev.id} – {ev.type}
                      </p>

                      {ev.type === 'note' && ev.description && (
                        <p className="whitespace-pre-wrap">{ev.description}</p>
                      )}

                      {ev.type === 'image' && ev.url && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={ev.url} alt="evidence" className="rounded-md max-h-64 mx-auto" />
                      )}

                      {ev.type === 'video' && ev.url && (
                        <video src={ev.url} controls className="rounded-md w-full max-h-64" />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}