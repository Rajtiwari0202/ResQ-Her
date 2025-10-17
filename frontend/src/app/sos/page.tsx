'use client';
import { useState, FormEvent } from 'react';
import { ArrowLeft, Zap, Send, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ExpandedMessage {
  expanded_text: string;
  model_used: string;
}

export default function SOSPage() {
  const { user } = useUser();
  const [keywords, setKeywords] = useState('');
  const [expandedMessage, setExpandedMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<Date | null>(null);

  const handleSendSOS = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // Use keywords or a default message if empty
    const messageToSend = keywords.trim() || "Immediate help needed at my location.";
    
    setIsLoading(true);
    setExpandedMessage('...'); // Clear previous message
    setLastSentTime(null);
    
    if (!API_BASE_URL) {
      alert("Error: Backend API URL not configured.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Call the SOS Text Expansion API (FastAPI)
      const apiResponse = await fetch(`${API_BASE_URL}/api/expand_message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: messageToSend }),
      });

      if (!apiResponse.ok) {
        throw new Error(`API Error: Status ${apiResponse.status}`);
      }

      const data: ExpandedMessage = await apiResponse.json();
      
      // 2. Display the expanded, formal message
      setExpandedMessage(data.expanded_text);
      setLastSentTime(new Date());

      // 3. (Future Step): Send to Emergency Contact Service (Mock Alert)
      console.log("--- DISPATCHING EXPANDED MESSAGE (Mock) ---");
      console.log(`To: Emergency Contacts & Police`);
      console.log(`From: ${user?.primaryEmailAddress?.emailAddress}`);
      console.log(`Location: [Real-time GPS coordinates would go here]`);
      console.log(`Message: ${data.expanded_text}`);
      console.log("------------------------------------------");

    } catch (error) {
      console.error('Error sending SOS:', error);
      setExpandedMessage("Failed to connect to the SOS service. Please check your network and ensure the FastAPI backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-red-600 text-white shadow-lg">
        <Link href="/" className="flex items-center space-x-2">
          <ArrowLeft className="h-6 w-6" />
          <h1 className="text-xl font-bold">Immediate SOS & Alert</h1>
        </Link>
        <Zap className="h-6 w-6 animate-pulse" />
      </header>

      {/* Main Content / Panic Button */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-red-50">
        <h2 className="text-4xl font-extrabold text-red-800 mb-6">
          Need Help Now.
        </h2>
        
        {/* Main Panic Button */}
        <button
          onClick={handleSendSOS}
          className={`w-64 h-64 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 transform 
            ${isLoading 
                ? 'bg-gray-400 scale-105 cursor-not-allowed' 
                : 'bg-red-700 hover:bg-red-800 active:scale-95 hover:shadow-red-500/50'
            }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-12 h-12 border-4 border-t-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Zap className="h-16 w-16 text-white" />
          )}
          <span className="text-white mt-2 text-lg font-semibold">
            {isLoading ? 'DISPATCHING...' : 'HOLD & TAP FOR HELP'}
          </span>
        </button>

        {/* Status Area */}
        <div className="mt-8 w-full max-w-md">
            {lastSentTime && (
                <p className="text-green-600 font-semibold mb-2">
                    ✅ Alert Sent Successfully at {lastSentTime.toLocaleTimeString()}
                </p>
            )}
            
            {/* Input Box for custom keywords */}
            <form onSubmit={handleSendSOS} className="flex flex-col space-y-3">
                <textarea
                    rows={2}
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Optional: Enter keywords (e.g., 'trap, locked, address is 123')"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="bg-red-500 text-white p-2 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-red-600 transition disabled:bg-gray-400"
                    disabled={isLoading}
                >
                    <Send className="h-4 w-4" />
                    <span>Send Detailed Alert</span>
                </button>
            </form>
        </div>
      </div>
      
      {/* Expanded Message Preview */}
      <div className="p-4 border-t border-gray-300 bg-gray-100">
        <h3 className="font-bold text-red-700 flex items-center space-x-1 mb-2">
            <MessageSquare className="h-4 w-4"/>
            <span>AI Message Preview:</span>
        </h3>
        <p className="text-sm text-gray-800 whitespace-pre-wrap">
            {expandedMessage || "Use the button or enter keywords to generate a formal alert message for authorities."}
        </p>
      </div>
    </div>
  );
}