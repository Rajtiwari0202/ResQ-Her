'use client';

import {
  ArrowLeft,
  BookOpenCheck,
  FileSearch,
  Gavel,
  Loader2,
  Scale,
  Send,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  sources?: string[];
}

const starters = [
  'What should I document after domestic violence?',
  'Can I ask for protection without my family knowing?',
  'What legal rights do I have if my partner controls money?',
];

export default function LawBotPage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'I can help you understand legal options in plain language. Share the situation, and I will separate urgent safety steps from longer-term legal action.',
      sources: ['Indian legal knowledge base', 'Constitution reference set'],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const ask = async (value = question) => {
    if (!value.trim() || loading) return;

    const prompt = value.trim();
    setMessages((prev) => [...prev, { text: prompt, sender: 'user' }]);
    setQuestion('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/law_bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { text: data.answer, sender: 'bot', sources: data.sources },
      ]);
    } catch (err) {
      console.error('Failed to get law bot response:', err);
      setError('Backend is offline, so a local demo answer was added.');
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'For immediate safety, move to a secure place and contact emergency services or a trusted local support person. Keep screenshots, dates, medical records, and witness details. For legal action, ask a qualified lawyer or women support cell about protection orders, complaint filing, custody, residence, and financial relief.',
          sources: ['Demo fallback', 'Project legal workflow'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <Scale size={22} />
          </span>
          <span>
            <p className="brand-title">Legal Rights Bot</p>
            <p className="brand-subtitle">Private RAG-style legal guidance</p>
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
              <Gavel size={16} />
              Rights, evidence, and next steps
            </p>
            <h1 className="page-title">Legal clarity without the courtroom language.</h1>
            <p className="page-copy">
              A survivor can ask sensitive questions and receive structured answers
              with visible source context, urgency cues, and practical documentation advice.
            </p>
          </div>
        </div>

        <div className="chat-layout">
          <aside className="glass-panel side-rail">
            <div className="avatar-orbit">
              <div className="avatar-core">
                <FileSearch size={54} />
              </div>
            </div>
            <div className="chip-row">
              <span className="chip">
                <ShieldCheck size={15} />
                Confidential
              </span>
              <span className="chip">
                <BookOpenCheck size={15} />
                Source-aware
              </span>
            </div>
            <div className="steps" style={{ marginTop: '1rem' }}>
              {starters.map((starter) => (
                <button className="step" key={starter} onClick={() => ask(starter)}>
                  <Scale size={18} />
                  <span>{starter}</span>
                </button>
              ))}
            </div>
          </aside>

          <section className="glass-panel chat-panel">
            <div className="chat-feed">
              {messages.map((message, index) => (
                <div className={`message ${message.sender}`} key={`${message.sender}-${index}`}>
                  {message.text}
                  {message.sources && message.sources.length > 0 && (
                    <div className="source-line">
                      Sources: {message.sources.join(' | ')}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="message bot">
                  <Loader2 className="animate-spin" size={18} /> Reading the knowledge base...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="composer">
              <input
                className="input"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') ask();
                }}
                placeholder="Ask about protection, evidence, custody, workplace harassment..."
              />
              <button className="solid-button" onClick={() => ask()} disabled={loading}>
                <Send size={18} />
                Send
              </button>
            </div>
            {error && <p className="error-text">{error}</p>}
          </section>
        </div>
      </section>
    </main>
  );
}
