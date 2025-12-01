import React, { useEffect, useState } from 'react';
import { UserStats } from '../types';
import { StarIcon, BadgeIcon, HeartIcon } from './icons';

interface TrackerProps {
  stats: UserStats;
}

const Tracker: React.FC<TrackerProps> = ({ stats }) => {
  const pointsToNextLevel = (stats.level + 1) * 100;
  const progressPercentage = (stats.points / pointsToNextLevel) * 100;
  const [animatePoints, setAnimatePoints] = useState(false);

  useEffect(() => {
    // Trigger animation when points change
    setAnimatePoints(true);
    const timer = setTimeout(() => setAnimatePoints(false), 400);
    return () => clearTimeout(timer);
  }, [stats.points]);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 w-full">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Your Growth Journey</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="flex flex-col items-center bg-pink-100 dark:bg-pink-900/50 p-4 rounded-xl">
          <StarIcon className={`w-8 h-8 text-pink-500 dark:text-pink-400 mb-2 transition-transform duration-300 ${animatePoints ? 'scale-125 rotate-12' : ''}`} />
          <span className={`text-2xl font-bold text-pink-800 dark:text-pink-200 transition-all duration-300 ${animatePoints ? 'animate-pop text-pink-600' : ''}`}>
             {stats.points}
          </span>
          <span className="text-sm text-pink-600 dark:text-pink-300">Love Points</span>
        </div>
        <div className="flex flex-col items-center bg-purple-100 dark:bg-purple-900/50 p-4 rounded-xl">
          <BadgeIcon className="w-8 h-8 text-purple-500 dark:text-purple-400 mb-2" />
          <span className="text-2xl font-bold text-purple-800 dark:text-purple-200">{stats.level}</span>
          <span className="text-sm text-purple-600 dark:text-purple-300">Level</span>
        </div>
        <div className="flex flex-col items-center bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-xl">
          <HeartIcon className="w-8 h-8 text-indigo-500 dark:text-indigo-400 mb-2" />
          <span className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">{stats.challengesCompleted}</span>
          <span className="text-sm text-indigo-600 dark:text-indigo-300">Challenges Done</span>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Level Progress</span>
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{stats.points} / {pointsToNextLevel}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-2.5 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progressPercentage}%` }}
          >
              <div className="absolute top-0 left-0 bottom-0 right-0 bg-white/30 animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracker;