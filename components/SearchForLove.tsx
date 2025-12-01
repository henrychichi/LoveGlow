

import React, { useState, useMemo } from 'react';
import { SingleProfile } from '../types';
import ProfileCard from './ProfileCard';
import { SearchIcon } from './icons';

// FIX: Changed `id` property to `uid` and converted it to a string to match the `SingleProfile` type definition.
const mockProfiles: SingleProfile[] = [
  { uid: 'mock-uid-1', name: 'Sophia', age: 28, imageUrl: 'https://picsum.photos/id/1027/400/600', bio: 'Adventurous soul who loves hiking, photography, and finding hidden coffee shops.', interests: ['Hiking', 'Photography', 'Coffee'] },
  { uid: 'mock-uid-2', name: 'Liam', age: 31, imageUrl: 'https://picsum.photos/id/1005/400/600', bio: 'Musician and dog lover. I spend my weekends writing songs or at the park with my golden retriever.', interests: ['Music', 'Dogs', 'Cooking'] },
  { uid: 'mock-uid-3', name: 'Olivia', age: 26, imageUrl: 'https://picsum.photos/id/1011/400/600', bio: 'Bookworm with a passion for travel. Looking for someone to explore new worlds with, both in books and reality.', interests: ['Reading', 'Travel', 'Museums'] },
  { uid: 'mock-uid-4', name: 'Noah', age: 29, imageUrl: 'https://picsum.photos/id/1012/400/600', bio: 'Tech enthusiast and fitness junkie. I enjoy a good workout followed by a competitive board game night.', interests: ['Fitness', 'Tech', 'Board Games'] },
  { uid: 'mock-uid-5', name: 'Emma', age: 30, imageUrl: 'https://picsum.photos/id/1015/400/600', bio: 'Artist who finds beauty in the everyday. I love painting, visiting art galleries, and long walks on the beach.', interests: ['Art', 'Beach', 'Yoga'] },
  { uid: 'mock-uid-6', name: 'James', age: 33, imageUrl: 'https://picsum.photos/id/1022/400/600', bio: 'Chef by trade, comedian by nature. My love language is feeding people delicious food.', interests: ['Cooking', 'Comedy', 'Movies'] },
  { uid: 'mock-uid-7', name: 'Isabella', age: 27, imageUrl: 'https://picsum.photos/id/1025/400/600', bio: 'Animal lover and volunteer. I believe in kindness and making the world a better place, one rescue at a time.', interests: ['Volunteering', 'Animals', 'Gardening'] },
  { uid: 'mock-uid-8', name: 'Benjamin', age: 32, imageUrl: 'https://picsum.photos/id/103/400/600', bio: 'Architect with an eye for design and a heart for adventure. Let\'s build something beautiful together.', interests: ['Architecture', 'Sailing', 'Jazz Music'] },
];

interface SearchForLoveProps {
  onConnect: (profile: SingleProfile) => void;
}

const SearchForLove: React.FC<SearchForLoveProps> = ({ onConnect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProfiles = useMemo(() => {
        if (!searchTerm) {
            return mockProfiles;
        }
        return mockProfiles.filter(profile =>
            profile.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="p-4 md:p-8">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-4">Find Your Connection</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Explore profiles of other singles on their own journey of growth. Connect with someone who shares your values and inspires you.
                </p>
            </div>

            <div className="max-w-2xl mx-auto mb-12">
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name..."
                        className="w-full p-4 pl-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <SearchIcon className="w-6 h-6 text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProfiles.map(profile => (
                    // FIX: Use `profile.uid` as the key, since it is the unique identifier on the `SingleProfile` type.
                    <ProfileCard key={profile.uid} profile={profile} onConnect={onConnect} />
                ))}
            </div>
             {filteredProfiles.length === 0 && (
                <div className="text-center col-span-full py-16">
                    <p className="text-xl text-gray-500 dark:text-gray-400">No profiles found matching "{searchTerm}".</p>
                </div>
            )}
        </div>
    );
};

export default SearchForLove;