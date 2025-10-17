'use client';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Mic } from 'lucide-react';

export default function TherapyBotPage() {
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <header className="flex items-center justify-between p-4 bg-purple-600 text-white shadow-md">
                <Link href="/" className="flex items-center space-x-2">
                    <ArrowLeft className="h-6 w-6" />
                    <h1 className="text-xl font-semibold">Therapy Bot (24/7 Support)</h1>
                </Link>
                <div className="flex items-center space-x-2 bg-purple-500 p-1 rounded-full text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Online</span>
                </div>
            </header>

            {/* AI Avatar and Chat Area */}
            <div className="flex-1 flex flex-col items-center justify-start p-6 overflow-y-auto">
                
                {/* Avatar Area Mock */}
                <div className="w-40 h-40 bg-purple-300 rounded-full shadow-xl mb-6 flex items-center justify-center border-4 border-purple-500">
                    <span className="text-purple-800 text-sm font-bold">AI Avatar</span>
                </div>

                {/* Status Message */}
                <div className="w-full max-w-lg p-4 bg-white border border-purple-200 rounded-lg shadow-lg text-center">
                    <p className="text-gray-700 font-medium">
                        "I am here to listen without judgment. All conversations are private and confidential."
                    </p>
                </div>

                {/* Mock Chat History */}
                <div className="w-full max-w-lg mt-8 space-y-4">
                    <div className="flex justify-start">
                        <div className="p-3 bg-purple-100 rounded-lg text-gray-800">
                            <p>Hi, I just need a safe space to talk right now.</p>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="p-3 bg-white border border-gray-300 rounded-lg text-gray-800">
                            <p>I hear you. Take a deep breath. What would you like to share with me today?</p>
                            <span className="text-xs text-gray-500 block mt-1">
                                (Simulated AI Response - Future API Integration)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-gray-300 bg-white">
                <div className="flex space-x-3">
                    <input
                        type="text"
                        placeholder="Type your message or hold the mic..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        disabled
                    />
                    <button
                        className="bg-purple-600 text-white p-3 rounded-lg flex items-center justify-center hover:bg-purple-700 transition disabled:bg-gray-400"
                        title="Mic input (Future Feature)"
                        disabled
                    >
                        <Mic className="h-5 w-5" />
                    </button>
                    <button
                        className="bg-purple-600 text-white p-3 rounded-lg flex items-center justify-center hover:bg-purple-700 transition disabled:bg-gray-400"
                        title="Send text (Future Feature)"
                        disabled
                    >
                        <MessageSquare className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}