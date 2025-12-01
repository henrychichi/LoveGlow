

import React from 'react';
import { SingleProfile } from '../types';
import { HeartIcon } from './icons';

interface ProfileCardProps {
  profile: SingleProfile;
  onConnect: (profile: SingleProfile) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onConnect }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative">
        <img src={profile.imageUrl} alt={profile.name} className="w-full h-64 object-cover" />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <h3 className="text-2xl font-bold text-white">{profile.name}, {profile.age}</h3>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 h-10 overflow-hidden">{profile.bio}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {profile.interests.slice(0, 3).map(interest => (
            <span key={interest} className="px-3 py-1 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded-full text-xs font-semibold">
              {interest}
            </span>
          ))}
        </div>
        <button 
          onClick={() => onConnect(profile)}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <HeartIcon className="w-5 h-5" />
          Connect
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;