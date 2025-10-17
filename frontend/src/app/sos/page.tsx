// frontend/src/app/sos/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SOSPage() {
  const [keywords, setKeywords] = useState('');
  const [expandedMessage, setExpandedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleExpandMessage = async () => {
    if (!keywords.trim()) {
      setError('Please enter some keywords.');
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExpandedMessage(data.expanded_text);
    } catch (err) {
      console.error('Failed to expand message:', err);
      setError('Failed to generate message. Please try again.');
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
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Immediate SOS & Alert</h1>
      </div>

      <div style={{ marginTop: '6rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', width: '100%', maxWidth: '600px', backgroundColor: '#2a2a35', padding: '2rem', borderRadius: '12px', border: '1px solid #cc0000' }}>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#cc0000', textAlign: 'center' }}>Need Help Now.</p>
        <span style={{ fontSize: '3rem', color: '#cc0000', animation: 'pulse 1.5s infinite' }}>⚡</span>
        <p style={{ fontSize: '1rem', color: '#f4f4f5', textAlign: 'center' }}>HOLD & TAP FOR HELP</p>

        {/* Keywords Input */}
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Optional: Enter keywords (e.g., 'trap, locked, address is 123')"
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #703091', backgroundColor: '#1c1c24', color: '#f4f4f5', outline: 'none' }}
        />

        {/* Send Detailed Alert Button */}
        <button
          onClick={handleExpandMessage}
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: loading ? '#888' : '#cc0000', color: 'white', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', border: 'none', transition: 'background-color 0.3s' }}
        >
          {loading ? 'Generating...' : 'Send Detailed Alert'}
        </button>

        {/* Error Message */}
        {error && <p style={{ color: '#ff6666', marginTop: '0.5rem' }}>{error}</p>}
      </div>

      {/* Message Preview */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', padding: '1rem', borderTop: '1px solid #703091', backgroundColor: '#2a2a35', color: '#f4f4f5' }}>
        <p style={{ fontSize: '0.9rem', color: '#ccc' }}>Message Preview:</p>
        <p style={{ marginTop: '0.5rem', minHeight: '3rem', border: '1px dashed #703091', padding: '0.5rem', borderRadius: '4px', backgroundColor: '#1c1c24' }}>
          {expandedMessage || 'Use the button or enter keywords to generate a formal alert message for authorities.'}
        </p>
      </div>

      {/* Pulsing animation for the lightning bolt */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}