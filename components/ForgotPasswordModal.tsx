import React, { useState } from 'react';
import { XIcon, PaperAirplaneIcon } from './icons';
import { sendPasswordResetEmail } from '../services/firebaseService';

interface ForgotPasswordModalProps {
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;
    
    setError(null);
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(email);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderContent = () => {
    if (isSuccess) {
      return (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Check Your Email</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            A password reset link has been sent to <strong>{email}</strong>. Please follow the instructions in the email to reset your password.
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
          >
            Close
          </button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Forgot Password</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">
          No worries! Enter your email below and we'll send you a link to reset your password.
        </p>

        {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg text-center text-sm mb-4">{error}</p>}
        
        <div>
            <label htmlFor="reset-email" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Email Address
            </label>
            <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
            required
            />
        </div>

        <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
        >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
            {!isLoading && <PaperAirplaneIcon className="w-5 h-5" />}
        </button>
      </form>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {!isSuccess && (
          <button onClick={onClose} disabled={isLoading} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition disabled:opacity-50">
            <XIcon className="w-6 h-6" />
          </button>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
