
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

/** Full-screen spinning neural network backdrop */
const NeuralNetViz: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

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

    svg.selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#22c55e')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.6);

    svg.selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 7)
      .attr('fill', '#10b981');

    const sim = forceSimulation(nodes as any)
      .alphaDecay(0.03)
      .force(
        'link',
        forceLink(links).id((d: any) => d.id).distance(120)
      )
      .force('charge', forceManyBody().strength(-80))
      .force('center', forceCenter(width / 2, height / 2))
      .on('tick', () => {
        svg.selectAll('circle')
          .attr('cx', (d: any) => d.x!)
          .attr('cy', (d: any) => d.y!);
        svg.selectAll('line')
          .attr('x1', (d: any) => d.source.x!)
          .attr('y1', (d: any) => d.source.y!)
          .attr('x2', (d: any) => d.target.x!)
          .attr('y2', (d: any) => d.target.y!);
      });

    return () => sim.stop();
  }, [nodes, links, width, height]);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none transform scale-125 animate-[spin_60s_linear_infinite]"
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
    <div className="w-full h-full bg-black text-green-400 font-mono relative overflow-y-auto">
      <section className="relative w-full h-screen overflow-hidden z-40">
        {size.width > 0 && <NeuralNetViz width={size.width} height={size.height} />}
        <nav className="flex justify-between items-center p-6 border-b border-green-600 relative z-50">
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
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
          <h2 className="text-4xl sm:text-5xl font-bold">Welcome to Detective</h2>
          <p className="max-w-xl text-lg text-green-300 mt-4">
            First tool to help find criminals and solve crime cases
          </p>
        </div>
      </section>
      <section className="relative w-full h-screen overflow-hidden flex justify-center items-center">
        <div className='w-[100rem] rounded-2xl flex justify-center'>
          <video
          src="/eyeball.mp4"
          autoPlay
          loop
          muted
          className="inset-0 h-full rounded-3xl"
        />
        </div> 
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          
        </div>
      </section>
    </div>
  );
}

