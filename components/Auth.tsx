import React, { useState } from 'react';
import { HeartIcon, UserPlusIcon, ArrowRightOnRectangleIcon } from './icons';
import { signInWithEmail, signUpWithEmail } from '../services/firebaseService';
import ForgotPasswordModal from './ForgotPasswordModal';

interface AuthProps {}

const Auth: React.FC<AuthProps> = () => {
  const [activeTab, setActiveTab] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (activeTab === 'signup') {
        await signUpWithEmail(email, password);
        // On success, the onAuthStateChanged listener in App.tsx will handle the next steps.
      } else {
        await signInWithEmail(email, password);
        // On success, the onAuthStateChanged listener in App.tsx will handle the next steps.
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const TabButton: React.FC<{
    label: string;
    tabName: 'signup' | 'signin';
    icon: React.ReactNode;
  }> = ({ label, tabName, icon }) => (
    <button
      type="button"
      onClick={() => { setActiveTab(tabName); setError(null); }}
      className={`w-full flex items-center justify-center gap-3 p-3 font-semibold transition-all duration-300 rounded-t-lg ${
        activeTab === tabName
          ? 'bg-white dark:bg-gray-800 text-pink-600 dark:text-pink-400'
          : 'bg-transparent text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <>
    {showForgotPassword && <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />}
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        <div className="text-center p-8 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30">
          <HeartIcon className="w-16 h-16 text-pink-500 dark:text-pink-400 mx-auto mb-4 animate-pulse" />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Welcome to LoveGrow</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Nurture your connection, one day at a time.</p>
        </div>

        <div className="bg-gray-200/50 dark:bg-gray-900/50 grid grid-cols-2">
            <TabButton label="Create Account" tabName="signup" icon={<UserPlusIcon className="w-6 h-6" />} />
            <TabButton label="Sign In" tabName="signin" icon={<ArrowRightOnRectangleIcon className="w-6 h-6" />} />
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg text-center text-sm">{error}</p>}
            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </label>
                 {activeTab === 'signin' && (
                    <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm font-semibold text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 transition"
                    >
                        Forgot Password?
                    </button>
                 )}
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? 'Processing...' : (activeTab === 'signup' ? 'Create Account' : 'Sign In')}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Auth;
