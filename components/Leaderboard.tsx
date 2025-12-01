import React from 'react';
import { UserStats } from '../types';
import { TrophyIcon } from './icons';

interface LeaderboardUser {
  uid: string;
  name: string;
  avatarUrl: string;
  points: number;
}

// Mock data for the leaderboard
const mockLeaderboardData: LeaderboardUser[] = [
  { uid: 'user-1', name: 'Jess & Tom', avatarUrl: 'https://i.pravatar.cc/150?u=jess-tom', points: 3450 },
  { uid: 'user-2', name: 'Sophia', avatarUrl: 'https://i.pravatar.cc/150?u=sophia', points: 3120 },
  { uid: 'user-3', name: 'David & Chloe', avatarUrl: 'https://i.pravatar.cc/150?u=david-chloe', points: 2980 },
  { uid: 'user-4', name: 'Liam', avatarUrl: 'https://i.pravatar.cc/150?u=liam', points: 2750 },
  { uid: 'user-5', name: 'Mike & Anna', avatarUrl: 'https://i.pravatar.cc/150?u=mike-anna', points: 2600 },
  { uid: 'user-6', name: 'Olivia', avatarUrl: 'https://i.pravatar.cc/150?u=olivia', points: 2400 },
  { uid: 'user-7', name: 'Sam & Ben', avatarUrl: 'https://i.pravatar.cc/150?u=sam-ben', points: 2150 },
  { uid: 'user-8', name: 'Noah', avatarUrl: 'https://i.pravatar.cc/150?u=noah', points: 1980 },
  { uid: 'user-9', name: 'James', avatarUrl: 'https://i.pravatar.cc/150?u=james', points: 1800 },
  { uid: 'user-10', name: 'Emma', avatarUrl: 'https://i.pravatar.cc/150?u=emma', points: 1750 },
  { uid: 'user-11', name: 'Isabella', avatarUrl: 'https://i.pravatar.cc/150?u=isabella', points: 1400 },
];

interface LeaderboardProps {
  currentUserData: {
    uid: string;
    name: string;
    stats: UserStats;
    avatarUrl: string;
  };
}

const Leaderboard: React.FC<LeaderboardProps> = ({ currentUserData }) => {
  const allUsers = mockLeaderboardData
    .concat({
      uid: currentUserData.uid,
      name: currentUserData.name,
      avatarUrl: currentUserData.avatarUrl,
      points: currentUserData.stats.points,
    })
    .sort((a, b) => b.points - a.points);
    
  const currentUserRank = allUsers.findIndex(u => u.uid === currentUserData.uid);
  const topThree = allUsers.slice(0, 3);
  const restOfTopTen = allUsers.slice(3, 10);

  const podiumOrder = [1, 0, 2]; // Used to display 2nd, 1st, 3rd

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="text-center mb-10">
        <TrophyIcon className="w-16 h-16 text-yellow-500 dark:text-yellow-400 mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-purple-700 dark:text-purple-300 mb-2">LoveGrow Leaders</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          See who is topping the charts in nurturing their connections. Keep growing!
        </p>
      </div>

      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <div className="flex justify-center items-end gap-2 md:gap-4 mb-12 min-h-[200px]">
          {podiumOrder.map(index => {
            if (!topThree[index]) return null;
            const user = topThree[index];
            const rank = index + 1;
            return (
              <div key={user.uid} className={`flex flex-col items-center transition-all duration-300 ${rank === 1 ? 'order-2' : (rank === 2 ? 'order-1' : 'order-3')}`}>
                <div className={`relative mb-2 ${rank === 1 ? 'w-28 h-28' : 'w-24 h-24'}`}>
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover border-4 shadow-lg"
                    style={{
                      borderColor: rank === 1 ? '#FFD700' : (rank === 2 ? '#C0C0C0' : '#CD7F32')
                    }}
                  />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                    style={{
                      backgroundColor: rank === 1 ? '#FFD700' : (rank === 2 ? '#C0C0C0' : '#CD7F32')
                    }}
                  >
                    {rank}
                  </div>
                </div>
                <div className={`p-2 rounded-lg text-center ${rank === 1 ? 'mt-2' : ''}`}>
                  <p className="font-bold text-gray-800 dark:text-white truncate max-w-[120px]">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.points} pts</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ranks 4-10 */}
      <div className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-4">
        <ul>
          {restOfTopTen.map((user, index) => {
            const rank = index + 4;
            return (
              <li key={user.uid} className="flex items-center p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <span className="text-lg font-bold text-gray-500 dark:text-gray-400 w-8">{rank}</span>
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover mx-4"/>
                <span className="font-semibold text-gray-700 dark:text-gray-200 flex-grow">{user.name}</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{user.points} pts</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Current User Fixed Banner */}
      {currentUserRank !== -1 && (
        <div className="fixed bottom-16 left-0 right-0 p-4 z-30 pointer-events-none">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow-2xl p-4 flex items-center gap-4 pointer-events-auto">
            <span className="text-2xl font-bold w-12 text-center">#{currentUserRank + 1}</span>
            <img src={currentUserData.avatarUrl} alt="You" className="w-12 h-12 rounded-full object-cover border-2 border-white"/>
            <div className="flex-grow">
              <p className="font-bold text-lg">Your Rank</p>
              <p className="text-sm opacity-90">{currentUserData.name}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">{currentUserData.stats.points} pts</p>
              <p className="text-sm opacity-90">Level {currentUserData.stats.level}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;