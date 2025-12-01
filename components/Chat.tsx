import React, { useState, useRef, useEffect } from 'react';
import { SingleProfile } from '../types';
import { ArrowLeftIcon, PaperAirplaneIcon } from './icons';

interface ChatProps {
  partner: SingleProfile;
  currentUser: SingleProfile;
  onBack: () => void;
}

// FIX: Changed senderId from number to string to accommodate the string-based `uid` from the SingleProfile type.
interface ChatMessage {
  text: string;
  senderId: string;
}

const TypingIndicator: React.FC<{ partner: SingleProfile }> = ({ partner }) => (
    <div className="flex items-end gap-3 justify-start">
        <img src={partner.imageUrl} alt={partner.name} className="w-8 h-8 rounded-full object-cover" />
        <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 rounded-bl-none">
            <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
);


const Chat: React.FC<ChatProps> = ({ partner, currentUser, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    // FIX: Used `partner.uid` instead of the non-existent `partner.id`.
    { senderId: partner.uid, text: `Hey ${currentUser.name}! I saw your profile and was really impressed. 😊` },
    { senderId: partner.uid, text: "I'm also really into hiking. Where's your favorite spot?" },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPartnerTyping]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // FIX: Used `currentUser.uid` instead of the non-existent `currentUser.id`.
      const userMessage = { senderId: currentUser.uid, text: newMessage.trim() };
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // Simulate partner typing and responding
      setIsPartnerTyping(true);
      setTimeout(() => {
        setIsPartnerTyping(false);
        // FIX: Used `partner.uid` instead of the non-existent `partner.id`.
        const partnerResponse = { senderId: partner.uid, text: "That's so interesting! Tell me more." };
        setMessages(prev => [...prev, partnerResponse]);
      }, 2000); // Simulate 2 seconds of typing
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg">
      {/* Header */}
      <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
        <img src={partner.imageUrl} alt={partner.name} className="w-10 h-10 rounded-full object-cover ml-4" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white ml-3">{partner.name}</h2>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          // FIX: Used `currentUser.uid` for message owner comparison.
          <div key={index} className={`flex items-end gap-3 ${msg.senderId === currentUser.uid ? 'justify-end' : 'justify-start'}`}>
            {/* FIX: Used `currentUser.uid` for comparison. */}
            {msg.senderId !== currentUser.uid && (
              <img src={partner.imageUrl} alt={partner.name} className="w-8 h-8 rounded-full object-cover" />
            )}
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
              // FIX: Used `currentUser.uid` for comparison.
              msg.senderId === currentUser.uid
                ? 'bg-pink-500 text-white rounded-br-none animate-slide-in-right'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none animate-slide-in-left'
            }`}>
              <p>{msg.text}</p>
            </div>
            {/* FIX: Used `currentUser.uid` for comparison. */}
            {msg.senderId === currentUser.uid && (
              <img src={currentUser.imageUrl} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover" />
            )}
          </div>
        ))}
        {isPartnerTyping && <TypingIndicator partner={partner} />}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Form */}
      <footer className="p-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
          />
          <button type="submit" className="p-3 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition disabled:bg-gray-400" disabled={!newMessage.trim()}>
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Chat;