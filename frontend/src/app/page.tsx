'use client';

import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import {
  ArrowRight,
  Bot,
  HeartHandshake,
  LockKeyhole,
  MapPinned,
  RadioTower,
  Scale,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    href: '/sos',
    title: 'Silent SOS',
    copy: 'Turn short danger keywords into a structured alert and hide the intent behind a calm interface.',
    icon: Zap,
  },
  {
    href: '/law-bot',
    title: 'Legal Rights Bot',
    copy: 'Ask private questions about rights, documents, and next steps with source-aware responses.',
    icon: Scale,
  },
  {
    href: '/therapy-bot',
    title: 'Care Companion',
    copy: 'A confidential support space for grounding, reflection, and emotional first aid.',
    icon: HeartHandshake,
  },
];

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="ResQ-Her home">
          <span className="brand-mark">
            <ShieldCheck size={22} />
          </span>
          <span>
            <p className="brand-title">ResQ-Her</p>
            <p className="brand-subtitle">A silent shield, a strong voice</p>
          </span>
        </Link>

        <div className="nav-actions">
          <Link className="ghost-button" href="/law-bot">
            <Scale size={17} />
            Law Bot
          </Link>
          {isLoaded && isSignedIn ? (
            <>
              <span className="chip">Hi, {user?.firstName || 'Protector'}</span>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="solid-button">Sign in</button>
            </SignInButton>
          )}
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">
            <RadioTower size={16} />
            Survivor-first safety operating system
          </p>
          <h1>ResQ-Her turns silence into a signal.</h1>
          <p className="hero-copy">
            A polished AI safety hub for discreet alerts, trauma-aware support,
            and practical legal guidance. Built for moments when asking for help
            has to be quiet, fast, and trusted.
          </p>

          <div className="hero-actions">
            <Link className="danger-button" href="/sos">
              Start SOS flow
              <ArrowRight size={18} />
            </Link>
            <Link className="ghost-button" href="/therapy-bot">
              Talk to care bot
              <Bot size={18} />
            </Link>
          </div>

          <div className="metric-row" aria-label="Project highlights">
            <div className="metric">
              <strong>3</strong>
              <span>critical support paths</span>
            </div>
            <div className="metric">
              <strong>24/7</strong>
              <span>private companion UI</span>
            </div>
            <div className="metric">
              <strong>RAG</strong>
              <span>legal guidance workflow</span>
            </div>
          </div>
        </div>

        <div className="mission-panel" aria-label="Live safety command preview">
          <div className="signal-map">
            <div className="signal-line" />
            <span className="pulse-node one">
              <LockKeyhole size={30} />
            </span>
            <span className="pulse-node two">
              <MapPinned size={30} />
            </span>
            <span className="pulse-node three">
              <Sparkles size={30} />
            </span>
          </div>
          <div className="status-strip">
            <div className="status-item">
              <span>Alert packet</span>
              Encoded
            </div>
            <div className="status-item">
              <span>Responder route</span>
              Ready
            </div>
            <div className="status-item">
              <span>Privacy mode</span>
              Active
            </div>
          </div>
        </div>
      </section>

      <section className="feature-band" aria-label="Core product modules">
        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link className="feature-card" href={feature.href} key={feature.title}>
                <span>
                  <span className="feature-icon">
                    <Icon size={22} />
                  </span>
                  <h2>{feature.title}</h2>
                  <p>{feature.copy}</p>
                </span>
                <span className="chip">
                  Open module
                  <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
