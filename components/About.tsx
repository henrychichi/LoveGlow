import React from 'react';
import { ArrowLeftIcon, HeartIcon, BookOpenIcon, LightBulbIcon, UsersIcon, ChatBubbleLeftRightIcon } from './icons';

interface AboutProps {
  onBack: () => void;
}

const FeatureItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-pink-100 dark:bg-pink-900/50 rounded-full flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    </div>
);

const About: React.FC<AboutProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg">
        {/* Header */}
        <header className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm z-10">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                <ArrowLeftIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white ml-4">About LoveGrow</h2>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            <div className="text-center">
                <HeartIcon className="w-20 h-20 text-pink-500 dark:text-pink-400 mx-auto mb-4 animate-pulse" />
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Nurture Your Connection</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
                    Welcome to LoveGrow, your personal guide to building stronger, healthier relationships.
                </p>
            </div>

            <div className="bg-white/50 dark:bg-gray-900/30 p-6 rounded-2xl">
                <h2 className="text-2xl font-bold text-center text-purple-700 dark:text-purple-300 mb-6">Our Mission</h2>
                <p className="text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                    In a fast-paced world, it's easy to lose touch with what matters most. LoveGrow was created to help you reconnect—with your partner, with yourself, and with a community dedicated to growth. We believe that every relationship, including the one you have with yourself, thrives on intention, communication, and a little bit of fun.
                </p>
            </div>

            <div className="bg-white/50 dark:bg-gray-900/30 p-6 rounded-2xl">
                <h2 className="text-2xl font-bold text-center text-purple-700 dark:text-purple-300 mb-8">Core Features</h2>
                <div className="space-y-6 max-w-3xl mx-auto">
                    <FeatureItem 
                        icon={<BookOpenIcon className="w-7 h-7 text-pink-500" />} 
                        title="Daily Challenges" 
                        description="Receive unique, AI-generated challenges tailored to your relationship status. These fun and meaningful tasks are designed to spark conversation, create new memories, and foster teamwork."
                    />
                    <FeatureItem 
                        icon={<LightBulbIcon className="w-7 h-7 text-pink-500" />} 
                        title="AI Relationship Coach" 
                        description="Get anonymous, supportive advice from our AI coach. Whether you have a question or just need to talk, the coach is a safe space to explore your thoughts and feelings."
                    />
                    <FeatureItem 
                        icon={<UsersIcon className="w-7 h-7 text-pink-500" />} 
                        title="The Love Wall" 
                        description="Share your successes and get inspired by a positive community. Post photos of your completed challenges and see how others are growing their relationships."
                    />
                    <FeatureItem 
                        icon={<ChatBubbleLeftRightIcon className="w-7 h-7 text-pink-500" />} 
                        title="Partner & Community Chat" 
                        description="Couples get a private chat to stay connected, while singles can meet and connect with others on a similar journey of self-discovery and growth."
                    />
                </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-900/30 p-6 rounded-2xl">
                <h2 className="text-2xl font-bold text-center text-purple-700 dark:text-purple-300 mb-6">Our Philosophy</h2>
                <p className="text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                    Your journey is personal and private. That's why LoveGrow operates locally on your device. We don't use servers to store your data, ensuring your conversations and progress remain yours alone. It's a safe, secure space for you to focus on what truly matters: your connection.
                </p>
            </div>

            <footer className="text-center text-gray-500 dark:text-gray-400 py-4">
                <p>Made with ❤️ for stronger connections everywhere.</p>
            </footer>
        </main>
    </div>
  );
};

export default About;