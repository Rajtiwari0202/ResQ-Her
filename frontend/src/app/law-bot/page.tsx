// frontend/src/app/law-bot/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  sources?: string[];
}

export default function LawBotPage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Scroll to bottom on new messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    const userMessage: ChatMessage = { text: question, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/law_bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = { text: data.answer, sender: 'bot', sources: data.sources };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Failed to get law bot response:', err);
      setError('Failed to get an answer. Please try again.');
      setMessages((prev) => [...prev, { text: 'Sorry, I could not retrieve an answer.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '2rem', backgroundColor: '#1c1c24', color: '#f4f4f5' }}>
      
      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '1rem', borderBottom: '1px solid #343440', backgroundColor: '#1c1c24', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <button onClick={() => router.back()} style={{ backgroundColor: 'transparent', border: 'none', color: '#f4f4f5', fontSize: '1.5rem', marginRight: '1rem', cursor: 'pointer' }}>
          ←
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Law Bot (RAG AI)</h1>
      </div>

      <div style={{ marginTop: '6rem', flexGrow: 1, width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', backgroundColor: '#2a2a35', borderRadius: '12px', border: '1px solid #703091', overflow: 'hidden' }}>
        
        {/* Chat Messages Area */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.9rem', color: '#ccc', textAlign: 'center', marginBottom: '1rem' }}>
            Hello! I am the ResQ-Her Law Bot. I provide confidential guidance on your legal rights based on our knowledge base. Ask me anything about your rights.
          </p>
          {messages.map((msg, index) => (
            <div key={index} style={{ 
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', 
              backgroundColor: msg.sender === 'user' ? '#4c7cff' : '#343440', 
              color: '#f4f4f5', 
              padding: '0.75rem 1rem', 
              borderRadius: '1rem', 
              maxWidth: '70%', 
              wordWrap: 'break-word' 
            }}>
              {msg.text}
              {msg.sources && msg.sources.length > 0 && (
                <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.25rem' }}>
                  <strong>Sources:</strong> {msg.sources.join(' | ')}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', backgroundColor: '#343440', color: '#f4f4f5', padding: '0.75rem 1rem', borderRadius: '1rem', maxWidth: '70%' }}>
              ...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div style={{ borderTop: '1px solid #703091', padding: '1rem', backgroundColor: '#2a2a35', display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
            placeholder="Ask a question about your legal rights..."
            style={{ flexGrow: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #703091', backgroundColor: '#1c1c24', color: '#f4f4f5', outline: 'none' }}
          />
          <button
            onClick={handleAskQuestion}
            disabled={loading}
            style={{ padding: '0.75rem 1.25rem', borderRadius: '8px', backgroundColor: loading ? '#888' : '#703091', color: 'white', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.3s' }}
          >
            Send
          </button>
        </div>
      </div>
      {error && <p style={{ color: '#ff6666', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}