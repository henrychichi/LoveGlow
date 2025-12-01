
import React from 'react';
import { Challenge } from '../types';
import { BookOpenIcon } from './icons';

interface ChallengeCardProps {
  challenge: Challenge;
  onComplete: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onComplete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:scale-105">
      <div>
        <div className="flex items-center mb-4">
          <div className="p-2 bg-pink-100 rounded-full mr-3">
            <BookOpenIcon className="w-6 h-6 text-pink-500" />
          </div>
          <h4 className="text-lg font-bold text-gray-800 capitalize">{challenge.type}</h4>
        </div>
        <p className="text-gray-600 mb-6">{challenge.content}</p>
      </div>
      <button
        onClick={onComplete}
        disabled={challenge.completed}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-300 ${
          challenge.completed
            ? 'bg-green-500 text-white cursor-not-allowed'
            : 'bg-pink-500 text-white hover:bg-pink-600'
        }`}
      >
        {challenge.completed ? 'Completed!' : 'Mark as Complete'}
      </button>
    </div>
  );
};

export default ChallengeCard;
