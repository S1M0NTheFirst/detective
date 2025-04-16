'use client';

import Link from 'next/link';
import React, { useRef, useEffect, useMemo, useState } from 'react';
import { select } from 'd3-selection';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
} from 'd3-force';

/** Full‑screen neural‑network backdrop — now rendered larger */
const NeuralNetViz: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Generate graph once
  const { nodes, links } = useMemo(() => {
    const N = 25; 
    const nodes = Array.from({ length: N }, (_, i) => ({ id: i }));
    const links: { source: number; target: number }[] = [];
    for (let i = 0; i < N * 2.5; i++) {
      const a = Math.floor(Math.random() * N);
      const b = Math.floor(Math.random() * N);
      if (a !== b) links.push({ source: a, target: b });
    }
    return { nodes, links };
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = select(svgRef.current).attr('viewBox', `0 0 ${width} ${height}`);

    svg
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#22c55e')
      .attr('stroke-width', 1.5) // thicker lines
      .attr('stroke-opacity', 0.6);

    svg
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 7) // make nodes bigger
      .attr('fill', '#10b981');

    const sim = forceSimulation(nodes as any)
      .alphaDecay(0.03)
      .force(
        'link',
        forceLink(links)
          .id((d: any) => d.id)
          .distance(120) // more space between nodes (overall graph bigger)
      )
      .force('charge', forceManyBody().strength(-80))
      .force('center', forceCenter(width / 2, height / 2))
      .on('tick', () => {
        svg
          .selectAll('circle')
          .attr('cx', (d: any) => d.x!)
          .attr('cy', (d: any) => d.y!);
        svg
          .selectAll('line')
          .attr('x1', (d: any) => d.source.x!)
          .attr('y1', (d: any) => d.source.y!)
          .attr('x2', (d: any) => d.target.x!)
          .attr('y2', (d: any) => d.target.y!);
      })
      .on('end', () => sim.stop());

    return () => sim.stop();
  }, [nodes, links, width, height]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full absolute inset-0 pointer-events-none transform scale-125 animate-[spin_60s_linear_infinite]" // scaled up ~25%
    />
  );
};

export default function HomePage() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {size.width > 0 && <NeuralNetViz width={size.width} height={size.height} />}

      <nav className="flex justify-between items-center p-6 border-b border-green-600 relative z-10">
        <h1 className="text-2xl font-bold">Detective</h1>
        <div className="space-x-4">
          <Link href="/auth/login" className="hover:text-white transition">
            Login
          </Link>
          <Link href="/auth/signup" className="hover:text-white transition">
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="relative z-10 text-center px-4 py-20 space-y-8">
        <h2 className="text-4xl sm:text-5xl font-bold">Welcome to Detective</h2>
        <p className="max-w-xl mx-auto text-lg text-green-300">
          First tool to help find criminal and solve crime cases
        </p>
      </main>
    </div>
  );
}

// After saving, Vite/Next.js HMR will refresh and show the larger network.
// No extra packages beyond d3/d3-selection/d3-force and Tailwind are required.
