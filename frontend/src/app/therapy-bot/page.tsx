'use client';

import {
  ArrowLeft,
  Brain,
  HeartHandshake,
  Leaf,
  Mic,
  Moon,
  Send,
  Sparkles,
  Wind,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

const moodCards = [
  { label: 'Grounding', copy: '5 things you see, 4 you feel, 3 you hear.', icon: Leaf },
  { label: 'Breathing', copy: 'Slow inhale for 4, hold for 2, exhale for 6.', icon: Wind },
  { label: 'Night support', copy: 'Short reflections for panic, shame, and fear.', icon: Moon },
  { label: 'Plan safety', copy: 'Name one trusted contact and one exit route.', icon: Brain },
];

export default function TherapyBotPage() {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: 'Hi, I just need a safe space to talk right now.', sender: 'user' },
    {
      text: 'You are not a burden here. Start with one sentence, or choose a grounding exercise from the left.',
      sender: 'bot',
    },
  ]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (value = inputMessage) => {
    if (!value.trim() || typing) return;

    const prompt = value.trim();
    setMessages((prev) => [...prev, { text: prompt, sender: 'user' }]);
    setInputMessage('');
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: 'I am with you. Let us make the next few minutes smaller: unclench your jaw, put both feet on the floor, and tell me what feels most urgent right now.',
          sender: 'bot',
        },
      ]);
      setTyping(false);
    }, 700);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <HeartHandshake size={22} />
          </span>
          <span>
            <p className="brand-title">Care Companion</p>
            <p className="brand-subtitle">Trauma-aware support space</p>
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
              <Sparkles size={16} />
              Private emotional first aid
            </p>
            <h1 className="page-title">A calmer room inside the app.</h1>
            <p className="page-copy">
              This screen makes the AI-avatar idea visible even without a 3D runtime:
              a soft companion, guided coping cards, and a chat that feels quiet and safe.
            </p>
          </div>
          <span className="chip">
            <span style={{ color: '#27d6b4' }}>Online</span>
          </span>
        </div>

        <div className="chat-layout">
          <aside className="glass-panel side-rail">
            <div className="avatar-orbit">
              <div className="avatar-core">
                <HeartHandshake size={56} />
              </div>
            </div>
            <div className="mood-grid">
              {moodCards.map((card) => {
                const Icon = card.icon;
                return (
                  <button
                    className="mood-card"
                    key={card.label}
                    onClick={() => sendMessage(card.copy)}
                  >
                    <Icon size={20} />
                    <h3>{card.label}</h3>
                    <p>{card.copy}</p>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="glass-panel chat-panel">
            <div className="chat-feed">
              {messages.map((message, index) => (
                <div className={`message ${message.sender}`} key={`${message.sender}-${index}`}>
                  {message.text}
                </div>
              ))}
              {typing && (
                <div className="message bot">
                  <Sparkles size={18} /> Companion is thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="composer">
              <button className="icon-button" title="Voice note placeholder" type="button">
                <Mic size={18} />
              </button>
              <input
                className="input"
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') sendMessage();
                }}
                placeholder="Type what you can say safely..."
              />
              <button className="solid-button" onClick={() => sendMessage()} disabled={typing}>
                <Send size={18} />
                Send
              </button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
