'use client';
import { useState, FormEvent, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

// Get the backend API URL from the environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Interface for the chat message structure
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  sources?: string[];
}

// Interface for the API response
interface LawBotResponse {
  answer: string;
  sources: string[];
}

export default function LawBotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Function to call the FastAPI endpoint to load legal data
  const loadLegalData = async () => {
    if (isDataLoaded) return;
    if (!API_BASE_URL) {
        console.error("API URL is not set.");
        return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/load_legal_data`, {
        method: 'POST',
      });
      if (response.ok) {
        console.log('Legal data loaded successfully.');
        setIsDataLoaded(true);
      } else {
        console.error('Failed to load legal data.', response.status);
      }
    } catch (error) {
      console.error('Error connecting to backend for data load:', error);
    }
  };

  // Automatically load data when the component mounts
  useEffect(() => {
    loadLegalData();
    // Add a welcome message to start the chat
    setMessages([{ 
        id: 0, 
        text: "Hello! I am the ResQ-Her Law Bot. I provide confidential guidance on your legal rights based on our knowledge base. Ask me anything about your rights.", 
        sender: 'bot' 
    }]);
  }, []);


  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (!API_BASE_URL) {
        console.error("API URL is not set. Cannot send request.");
        setIsLoading(false);
        return;
    }

    try {
      const apiResponse = await fetch(`${API_BASE_URL}/api/law_bot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      if (!apiResponse.ok) {
        throw new Error(`Backend API responded with status ${apiResponse.status}`);
      }

      const data: LawBotResponse = await apiResponse.json();
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: data.answer,
        sender: 'bot',
        sources: data.sources,
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error('Error fetching Law Bot response:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "I'm sorry, I couldn't connect to the legal AI service. Please ensure the FastAPI backend is running.",
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper component to render a single chat bubble
  const ChatBubble = ({ message }: { message: Message }) => (
    <div 
        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
        <div 
            className={`max-w-3/4 p-4 rounded-xl shadow-md ${
                message.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-200 text-gray-800 rounded-tl-none'
            }`}
        >
            <p className="whitespace-pre-wrap">{message.text}</p>
            {message.sources && message.sources.length > 0 && message.sender === 'bot' && (
                <div className="mt-3 pt-2 border-t border-gray-400 text-xs opacity-75">
                    <strong>Sources Used:</strong>
                    <ul className="list-disc list-inside mt-1">
                        {message.sources.map((source, index) => (
                            <li key={index} className='mt-1'>{source}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>
  );


  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-pink-600 text-white shadow-md">
        <Link href="/" className="flex items-center space-x-2">
          <ArrowLeft className="h-6 w-6" />
          <h1 className="text-xl font-semibold">Law Bot (RAG AI)</h1>
        </Link>
        {!isDataLoaded && (
            <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-medium">
                Loading Knowledge Base...
            </span>
        )}
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="max-w-3/4 p-4 rounded-xl shadow-md bg-gray-200 text-gray-800 rounded-tl-none">
                    <p className="animate-pulse">Bot is thinking...</p>
                </div>
            </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-gray-300 bg-gray-50">
        <form onSubmit={handleSend} className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your legal rights..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-pink-600 text-white p-3 rounded-lg flex items-center justify-center hover:bg-pink-700 transition disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-t-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}