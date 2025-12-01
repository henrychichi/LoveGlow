import React, { useState, useRef, useEffect } from 'react';
import { RelationshipStatus } from '../types';
import { LightBulbIcon, PaperAirplaneIcon, TrashIcon, RefreshIcon, ArrowLeftIcon } from './icons';
import { createAdviceChat } from '../services/geminiService';
import { Chat } from '@google/genai';

interface AICoachProps {
  status: RelationshipStatus;
  onBack: () => void;
}

interface AdviceMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  error?: boolean;
}

const AITypingIndicator: React.FC = () => (
    <div className="flex items-end gap-3 justify-start">
        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-full">
            <LightBulbIcon className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
        </div>
        <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 rounded-bl-none">
            <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
);

const AICoach: React.FC<AICoachProps> = ({ status, onBack }) => {
  const getInitialMessage = (): AdviceMessage => ({ 
    id: Date.now(), 
    sender: 'ai' as const, 
    text: "Hello! I'm the LoveGrow Coach. What's on your mind? Your chat is anonymous and safe.",
    error: false,
  });
  
  const [adviceChat, setAdviceChat] = useState<Chat | null>(null);
  const [adviceMessages, setAdviceMessages] = useState<AdviceMessage[]>([getInitialMessage()]);
  const [currentAdviceMessage, setCurrentAdviceMessage] = useState('');
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);
  const adviceMessagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      adviceMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [adviceMessages, isAdviceLoading]);

  const handleClearConversation = () => {
    if (window.confirm("Are you sure you want to clear this conversation? This action cannot be undone.")) {
      setAdviceMessages([getInitialMessage()]);
      setAdviceChat(null); // Reset the chat session
    }
  };

  const sendMessage = async (messageText: string, messageIdToUpdate?: number) => {
    const messageId = messageIdToUpdate || Date.now();

    if (!messageIdToUpdate) {
      const newUserMessage: AdviceMessage = { id: messageId, sender: 'user', text: messageText, error: false };
      setAdviceMessages(prev => [...prev, newUserMessage]);
    } else {
      // This is a retry, so we just clear the error state before resending
      setAdviceMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, error: false } : msg));
    }
    
    setIsAdviceLoading(true);

    try {
        let chatInstance = adviceChat;
        if (!chatInstance) {
            chatInstance = createAdviceChat(status);
            setAdviceChat(chatInstance);
        }
        
        const response = await chatInstance.sendMessage({ message: messageText });
        const aiResponse: AdviceMessage = { id: Date.now(), sender: 'ai', text: response.text, error: false };
        setAdviceMessages(prev => [...prev, aiResponse]);
        
    } catch (err) {
        console.error("Error sending message to AI coach:", err);
        // Mark the user's message as having an error
        setAdviceMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, error: true } : msg));
    } finally {
        setIsAdviceLoading(false);
    }
  };

  const handleSendAdviceMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      const messageText = currentAdviceMessage.trim();
      if (!messageText || isAdviceLoading) return;

      setCurrentAdviceMessage('');
      await sendMessage(messageText);
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg">
      {/* Header */}
      <header className="relative flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10">
        <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Go back"
        >
            <ArrowLeftIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-full">
                <LightBulbIcon className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white ml-3">AI Coach</h2>
        </div>
        <button 
            onClick={handleClearConversation}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Clear conversation"
        >
            <TrashIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-6 space-y-1">
          {adviceMessages.map((msg) => (
              <div key={msg.id}>
                  <div className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.sender === 'ai' && (
                          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-full self-start">
                              <LightBulbIcon className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                          </div>
                      )}
                      <div className={`max-w-xs md:max-w-md p-3 rounded-2xl transition-opacity ${
                        msg.sender === 'user'
                          ? `bg-yellow-300 dark:bg-yellow-500 text-black rounded-br-none ${msg.error ? 'opacity-70' : ''}`
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                      }`}>
                          <p className="break-words">{msg.text}</p>
                      </div>
                  </div>
                  {msg.sender === 'user' && msg.error && (
                      <div className="flex justify-end items-center gap-2 mt-1 pr-2">
                          <span className="text-xs text-red-500 dark:text-red-400">Failed to send.</span>
                          <button
                              onClick={() => sendMessage(msg.text, msg.id)}
                              disabled={isAdviceLoading}
                              className="p-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 disabled:text-gray-400 disabled:hover:bg-transparent"
                              aria-label="Retry sending message"
                          >
                              <RefreshIcon className="w-4 h-4" />
                          </button>
                      </div>
                  )}
              </div>
          ))}
          {isAdviceLoading && <AITypingIndicator />}
          <div ref={adviceMessagesEndRef} />
      </main>

      {/* Input Form */}
      <footer className="p-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <form onSubmit={handleSendAdviceMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={currentAdviceMessage}
            onChange={(e) => setCurrentAdviceMessage(e.target.value)}
            placeholder="Ask for anonymous advice..."
            className="flex-1 w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full focus:ring-2 focus:ring-yellow-300 dark:focus:ring-yellow-500 focus:border-transparent transition"
            disabled={isAdviceLoading}
          />
          <button type="submit" className="p-3 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition disabled:bg-gray-400" disabled={!currentAdviceMessage.trim() || isAdviceLoading}>
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default AICoach;