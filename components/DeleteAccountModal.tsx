import React, { useState } from 'react';
import { XIcon, ExclamationTriangleIcon } from './icons';

interface DeleteAccountModalProps {
  onClose: () => void;
  onConfirmDelete: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ onClose, onConfirmDelete }) => {
  const [step, setStep] = useState(1);
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    // Simulate a short delay for effect and to allow UI to update
    setTimeout(() => {
        onConfirmDelete();
    }, 1000);
  };

  const isConfirmationMatch = confirmationText === 'DELETE';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <button onClick={onClose} disabled={isDeleting} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition disabled:opacity-50">
          <XIcon className="w-6 h-6" />
        </button>
        
        <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="w-10 h-10 text-red-500" />
            </div>

            {step === 1 && (
                <>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Are you absolutely sure?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">
                        Deleting your account is permanent. All your progress, profile data, and memories will be lost forever. This action cannot be undone.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={onClose}
                            className="w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => setStep(2)}
                            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition"
                        >
                            I Understand, Proceed
                        </button>
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Final Confirmation</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 mb-6">
                        To confirm this action, please type <strong className="text-red-500 dark:text-red-400 font-mono">DELETE</strong> in the box below.
                    </p>
                    <input
                        type="text"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        className="w-full p-3 text-center tracking-widest font-mono border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition mb-6"
                        placeholder="DELETE"
                        disabled={isDeleting}
                        autoCapitalize="off"
                        autoCorrect="off"
                    />
                     <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={!isConfirmationMatch || isDeleting}
                            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition disabled:bg-red-400 dark:disabled:bg-red-800 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete My Account'}
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
