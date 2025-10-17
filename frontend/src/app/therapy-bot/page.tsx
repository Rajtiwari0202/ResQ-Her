// frontend/src/app/therapy-bot/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

export default function TherapyBotPage() {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: "Hi, I just need a safe space to talk right now.", sender: 'user' },
    { text: "I hear you. Take a deep breath. What would you like to share with me today?", sender: 'bot' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Scroll to bottom on new messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = { text: inputMessage, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response (replace with actual API call for Gemini in the future)
    setTimeout(() => {
      const botResponse: ChatMessage = { text: "I'm here to listen. Tell me more about what's on your mind.", sender: 'bot' };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '2rem', backgroundColor: '#1c1c24', color: '#f4f4f5' }}>
      
      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '1rem', borderBottom: '1px solid #343440', backgroundColor: '#1c1c24', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => router.back()} style={{ backgroundColor: 'transparent', border: 'none', color: '#f4f4f5', fontSize: '1.5rem', marginRight: '1rem', cursor: 'pointer' }}>
            ←
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Therapy Bot (24/7 Support)</h1>
        </div>
        <span style={{ fontSize: '0.9rem', color: '#703091', fontWeight: 'bold' }}>Online</span>
      </div>

      <div style={{ marginTop: '6rem', flexGrow: 1, width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', backgroundColor: '#2a2a35', borderRadius: '12px', border: '1px solid #703091', overflow: 'hidden' }}>
        
        {/* Bot Intro/Avatar */}
        <div style={{ padding: '1rem', backgroundColor: '#343440', textAlign: 'center', borderBottom: '1px solid #703091' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#703091', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
            AI
          </div>
          <p style={{ fontSize: '0.9rem', color: '#ccc', marginTop: '0.5rem' }}>"I am here to listen without judgment. All conversations are private and confidential."</p>
        </div>

        {/* Chat Messages Area */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              {msg.sender === 'bot' && index === messages.length - 1 && (
                <p style={{ fontSize: '0.75rem', color: '#ccc', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.25rem' }}>
                  (Simulated AI Response - Future API Integration)
                </p>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div style={{ borderTop: '1px solid #703091', padding: '1rem', backgroundColor: '#2a2a35', display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message or hold the mic..."
            style={{ flexGrow: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #703091', backgroundColor: '#1c1c24', color: '#f4f4f5', outline: 'none' }}
          />
          <button
            onClick={handleSendMessage}
            style={{ padding: '0.75rem 1.25rem', borderRadius: '8px', backgroundColor: '#703091', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: 'background-color 0.3s' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}