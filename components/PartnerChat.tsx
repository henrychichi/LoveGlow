
import React, { useState, useRef, useEffect } from 'react';
import { CoupleProfile } from '../types';
import { ArrowLeftIcon, PaperAirplaneIcon } from './icons';

interface PartnerChatProps {
  profile: CoupleProfile;
  currentUserIndex: 0 | 1; // To know which partner is sending the message
  onBack: () => void;
}

interface ChatMessage {
  text: string;
  senderIndex: 0 | 1; // 0 for names[0], 1 for names[1]
}

const PartnerChat: React.FC<PartnerChatProps> = ({ profile, currentUserIndex, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { senderIndex: 0, text: `Hey! Don't forget it's movie night tonight.` },
    { senderIndex: 1, text: "Of course not! Can't wait. ❤️" },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMessage: ChatMessage = { senderIndex: currentUserIndex, text: newMessage.trim() };
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg">
      <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <ArrowLeftIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="relative w-10 h-10 ml-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-[70%] -translate-y-[70%] w-7 h-7 bg-pink-200 dark:bg-pink-800 rounded-full flex items-center justify-center text-sm font-bold text-pink-600 dark:text-pink-200 ring-2 ring-white dark:ring-gray-800">
                {profile.names[0]?.[0]}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-[30%] -translate-y-[30%] w-7 h-7 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-200 ring-2 ring-white dark:ring-gray-800">
                {profile.names[1]?.[0]}
            </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white ml-3">{profile.names.join(' & ')}</h2>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-3 ${msg.senderIndex === currentUserIndex ? 'justify-end' : 'justify-start'}`}>
            {msg.senderIndex !== currentUserIndex && (
              <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-300 dark:bg-gray-600 flex items-center justify-center font-bold text-gray-600 dark:text-gray-200">
                  {profile.names[msg.senderIndex]?.[0]}
              </div>
            )}
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
              msg.senderIndex === currentUserIndex
                ? 'bg-pink-500 text-white rounded-br-none'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
            }`}>
              <p className="break-words">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

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

export default PartnerChat;
