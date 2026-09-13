'use client';

import React from 'react';
import { Navbar } from '@/components/navbar/Navbar';
import { About } from '@/components/about/About';
import { Container } from '@/components/liquid/Container';
import { SparklesBackground } from '@/components/ui/sparkles';
import { Noise } from '@/components/ui/noisy';
import { Experience } from '@/components/experience/experience';

const experiences = [
  {
    role: 'Staff Software Engineer — Scalability & Architecture',
    company: 'Distributed Systems Lab',
    period: '2023 — Present',
    description:
      'Spearheading high-throughput backend services and distributed consensus engines. Reduced p99 latency by 45% across core APIs processing over 50M requests daily.',
    skills: ['Go', 'Distributed Systems', 'Kafka', 'Kubernetes', 'Redis'],
  },
  {
    role: 'Senior Full Stack Engineer',
    company: 'Nexus Technologies',
    period: '2021 — 2023',
    description:
      'Engineered real-time collaboration platforms and high-performance WebGL/SVG visualization components. Mentored 8 engineers and championed modern CI/CD pipelines.',
    skills: ['TypeScript', 'Next.js', 'React', 'Node.js', 'PostgreSQL'],
  },
  {
    role: 'Systems Software Engineer',
    company: 'CloudCore Infrastructure',
    period: '2019 — 2021',
    description:
      'Built resilient telemetry microservices and optimized internal database queries, reducing memory consumption by 30% across production workloads.',
    skills: ['Go', 'Docker', 'gRPC', 'Prometheus', 'Linux Systems'],
  },
];

const projects = [
  {
    title: 'Liquid Glass Engine',
    category: 'Graphics & UI Physics',
    description:
      'A zero-dependency real-time SVG displacement map and refraction pipeline simulating authentic liquid water droplet optics across browsers.',
    tags: ['React', 'SVG Shaders', 'TypeScript', 'Math'],
  },
  {
    title: 'HyperFlow Distributed Queue',
    category: 'Systems & Infrastructure',
    description:
      'High-performance distributed event streaming pipeline capable of processing 100k+ msg/sec with sub-millisecond p99 latency.',
    tags: ['Go', 'Raft', 'Zero-Copy', 'Protobuf'],
  },
  {
    title: 'Aura Metrics Dashboard',
    category: 'Cloud Telemetry',
    description:
      'Real-time observability platform featuring dynamic anomaly detection and automated eBPF tracing visualizations.',
    tags: ['Next.js', 'eBPF', 'TimescaleDB', 'Tailwind CSS'],
  },
  {
    title: 'Vortex Cache Proxy',
    category: 'Networking & Edge',
    description:
      'Lightweight reverse proxy with intelligent LRU cache eviction and edge TLS termination implemented in Go.',
    tags: ['Go', 'HTTP/3', 'Edge Computing', 'Concurrency'],
  },
];

const skillCategories = [
  {
    category: 'Languages & Core',
    items: ['TypeScript', 'JavaScript', 'Go', 'Python', 'SQL', 'HTML5/CSS3'],
  },
  {
    category: 'Frameworks & UI',
    items: [
      'Next.js',
      'React',
      'Tailwind CSS',
      'Node.js',
      'Express',
      'Framer Motion',
    ],
  },
  {
    category: 'Systems & Cloud',
    items: [
      'Docker',
      'Kubernetes',
      'Redis',
      'Kafka',
      'PostgreSQL',
      'AWS',
      'Linux',
    ],
  },
];

export default function Home() {
  return (
    <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
      <Container
        className="p-6 sm:p-8 rounded-[32px] col-span-1 lg:col-span-2"
        radius={46}
        optics={{
          strength: 0.5,
          curvature: 2.0,
          bend: 1.8,
          bendWidth: 0.35,
          dispersion: 3.0,
          specular: 2.0,
          specularAngle: 180,
        }}
      >
        <About />
      </Container>
      <Container
        className="p-6 sm:p-8 rounded-[32px] col-span-1"
        radius={46}
        optics={{
          strength: 0.5,
          curvature: 2.0,
          bend: 1.8,
          bendWidth: 0.35,
          dispersion: 3.0,
          specular: 2.0,
          specularAngle: 180,
        }}
      >
        <Experience />
      </Container>
    </div>
  );
}
