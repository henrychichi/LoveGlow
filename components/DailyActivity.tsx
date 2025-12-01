import React, { useEffect, useState } from 'react';
import { Challenge } from '../types';
import { BookOpenIcon, CheckIcon } from './icons';

interface DailyActivityProps {
  activity: Challenge;
  onComplete: () => void;
}

const DailyActivity: React.FC<DailyActivityProps> = ({ activity, onComplete }) => {
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    if (activity.completed) {
      setJustCompleted(true);
      const timer = setTimeout(() => setJustCompleted(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [activity.completed]);

  return (
    <div 
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 flex flex-col justify-between transition-all duration-500 hover:shadow-xl hover:scale-[1.02] ${justCompleted ? 'animate-success-pulse border-2 border-pink-400' : ''}`}
    >
      <div>
        <div className="flex items-center mb-4">
          <div className={`p-2 rounded-full mr-3 transition-colors duration-500 ${activity.completed ? 'bg-green-100 dark:bg-green-900/50' : 'bg-pink-100 dark:bg-pink-900/30'}`}>
            {activity.completed ? (
                <CheckIcon className="w-6 h-6 text-green-500" />
            ) : (
                <BookOpenIcon className="w-6 h-6 text-pink-500 dark:text-pink-400" />
            )}
          </div>
          <h4 className="text-lg font-bold text-gray-800 dark:text-white capitalize">{activity.type}</h4>
        </div>
        <p className={`text-gray-600 dark:text-gray-300 mb-6 transition-opacity duration-300 ${activity.completed ? 'opacity-50 line-through' : ''}`}>{activity.content}</p>
      </div>
      <button
        onClick={onComplete}
        disabled={activity.completed}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 transform active:scale-95 ${
          activity.completed
            ? 'bg-green-500 text-white cursor-not-allowed shadow-inner'
            : 'bg-pink-500 text-white hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 shadow-md hover:shadow-lg'
        }`}
      >
        {activity.completed ? 'Done!' : 'Mark as Done'}
      </button>
    </div>
  );
};

export default DailyActivity;