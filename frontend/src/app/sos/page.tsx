'use client';

import {
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  MapPinned,
  RadioTower,
  Send,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

export default function SOSPage() {
  const [keywords, setKeywords] = useState('locked room, cannot call, need police near metro gate');
  const [expandedMessage, setExpandedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const preview = useMemo(() => {
    if (expandedMessage) return expandedMessage;
    return 'I need urgent help. I am unable to speak safely. Please treat this as a priority distress alert and dispatch support to my current location.';
  }, [expandedMessage]);

  const handleExpandMessage = async () => {
    if (!keywords.trim()) {
      setError('Add a few keywords so the alert can be expanded.');
      return;
    }

    setError('');
    setLoading(true);
    setExpandedMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/expand_message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywords }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setExpandedMessage(data.expanded_text);
    } catch (err) {
      console.error('Failed to expand message:', err);
      setError('Backend is unavailable, so this screen is showing the local safe-alert preview.');
      setExpandedMessage(
        `Priority distress alert: ${keywords}. I may be monitored and cannot call safely. Please send verified emergency support and use my latest shared location.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <ShieldAlert size={22} />
          </span>
          <span>
            <p className="brand-title">Silent SOS</p>
            <p className="brand-subtitle">Generate, encode, and route a distress signal</p>
          </span>
        </Link>
        <Link className="ghost-button" href="/">
          <ArrowLeft size={17} />
          Dashboard
        </Link>
      </header>

      <section className="page-wrap">
        <div className="page-head">
          <div>
            <p className="eyebrow">
              <RadioTower size={16} />
              Emergency signal builder
            </p>
            <h1 className="page-title">Help can start with three quiet words.</h1>
            <p className="page-copy">
              Type fragments, locations, or clues. ResQ-Her expands them into a formal
              responder-ready alert while preserving a calm, low-attention interface.
            </p>
          </div>
          <button className="danger-button" onClick={handleExpandMessage} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            Build alert
          </button>
        </div>

        <div className="sos-grid">
          <div className="glass-panel sos-card">
            <button className="sos-button" onClick={handleExpandMessage} disabled={loading}>
              <span>
                <strong>SOS</strong>
                <span>hold-ready alert</span>
              </span>
            </button>
            <div className="chip-row">
              <span className="chip">
                <MapPinned size={15} />
                Location packet
              </span>
              <span className="chip">
                <ImageIcon size={15} />
                Stego-ready message
              </span>
              <span className="chip">
                <CheckCircle2 size={15} />
                Authority format
              </span>
            </div>
          </div>

          <div className="glass-panel sos-card form-stack">
            <div className="field">
              <label htmlFor="keywords">Distress keywords</label>
              <textarea
                className="textarea"
                id="keywords"
                value={keywords}
                onChange={(event) => setKeywords(event.target.value)}
                placeholder="Example: trapped, blue gate, husband angry, cannot call"
              />
            </div>

            <div>
              <div className="step">
                <Sparkles size={20} />
                <span>
                  <strong>AI expansion</strong>
                  <br />
                  Converts fragments into a concise emergency message.
                </span>
              </div>
              <div className="step">
                <ImageIcon size={20} />
                <span>
                  <strong>Innocent carrier</strong>
                  <br />
                  Designed for the project steganography flow described in the repo.
                </span>
              </div>
            </div>

            <div>
              <label className="field">
                <span>Responder preview</span>
              </label>
              <div className="alert-preview">{preview}</div>
            </div>
            {error && <p className="error-text">{error}</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
