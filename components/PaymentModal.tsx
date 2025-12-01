import React, { useState } from 'react';
import { XIcon, CreditCardIcon, DevicePhoneMobileIcon, HeartIcon } from './icons';

interface PaymentModalProps {
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing || isSuccess) return;
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Automatically proceed after showing success message
      setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
    }, 2000);
  };

  const renderContent = () => {
    if (isProcessing) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 h-64">
          <HeartIcon className="w-16 h-16 text-pink-500 dark:text-pink-400 animate-pulse mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Processing Payment...</h3>
          <p className="text-gray-500 dark:text-gray-400">Please wait, this won't take long.</p>
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 h-64">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Payment Successful!</h3>
          <p className="text-gray-500 dark:text-gray-400">Welcome to a week of growth!</p>
        </div>
      );
    }
    
    return (
      <form onSubmit={handleSubmit} className="p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Activate Your Access</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Choose your preferred payment method to unlock 7 days of challenges.</p>

        {/* Payment Method Toggles */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
              paymentMethod === 'card'
                ? 'bg-pink-50 border-pink-500 text-pink-600 dark:bg-pink-900/30 dark:border-pink-500 dark:text-pink-400'
                : 'bg-gray-100 border-transparent text-gray-600 hover:border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <CreditCardIcon className="w-6 h-6" />
            <span className="font-semibold">Card</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('mobile')}
            className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
              paymentMethod === 'mobile'
                ? 'bg-pink-50 border-pink-500 text-pink-600 dark:bg-pink-900/30 dark:border-pink-500 dark:text-pink-400'
                : 'bg-gray-100 border-transparent text-gray-600 hover:border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <DevicePhoneMobileIcon className="w-6 h-6" />
            <span className="font-semibold">Airtel</span>
          </button>
        </div>

        {/* Form Fields */}
        {paymentMethod === 'card' ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Card Number</label>
              <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Date</label>
                <input type="text" id="expiry" placeholder="MM / YY" className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md" required />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 dark:text-gray-300">CVC</label>
                <input type="text" id="cvc" placeholder="123" className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md" required />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Airtel Phone Number</label>
            <input type="tel" id="phoneNumber" placeholder="e.g., 0977123456" className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-md" required />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">You will receive a prompt on your phone to approve the payment of K5.</p>
          </div>
        )}

        <button
          type="submit"
          className="mt-8 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 px-4 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Pay K5 and Activate
        </button>
      </form>
    );
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {!isProcessing && !isSuccess && (
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
            <XIcon className="w-6 h-6" />
          </button>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentModal;